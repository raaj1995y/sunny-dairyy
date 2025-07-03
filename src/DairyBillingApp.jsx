import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAs } from 'file-saver';

export default function DairyBillingApp() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [milkType, setMilkType] = useState("");
  const [price, setPrice] = useState("");
  const [dailyLog, setDailyLog] = useState([]);

  const addCustomer = () => {
    setCustomers([...customers, { name, milkType, price, logs: [] }]);
    setName("");
    setMilkType("");
    setPrice("");
  };

  const addDailyEntry = (index, quantity) => {
    const date = new Date().toISOString().split('T')[0];
    const newCustomers = [...customers];
    newCustomers[index].logs.push({ date, quantity });
    setCustomers(newCustomers);
  };

  const calculateMonthly = (logs) => {
    const totalLitres = logs.reduce((sum, log) => sum + parseFloat(log.quantity), 0);
    return totalLitres;
  };

  const generateReport = (cust) => {
    const totalL = calculateMonthly(cust.logs);
    const totalAmount = totalL * parseFloat(cust.price);
    const report = `Customer: ${cust.name}\nMilk Type: ${cust.milkType}\nRate: ₹${cust.price}/L\nTotal Days: ${cust.logs.length}\nTotal Litres: ${totalL}L\nTotal Bill: ₹${totalAmount}\n\nDelivery Log:\n` +
      cust.logs.map(log => `${log.date}: ${log.quantity}L`).join('\n');

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${cust.name.replace(/\s+/g, '_')}_Milk_Report.txt`);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dairy Billing System</h1>

      <Card className="mb-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <Input placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Milk Type" value={milkType} onChange={e => setMilkType(e.target.value)} />
          <Input type="number" placeholder="Price/Litre" value={price} onChange={e => setPrice(e.target.value)} />
          <Button onClick={addCustomer}>Add Customer</Button>
        </CardContent>
      </Card>

      {customers.map((cust, index) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{cust.name}</h2>
              <div className="text-sm">{cust.milkType} @ ₹{cust.price}/L</div>
            </div>
            <div className="flex gap-2 mb-2">
              <Input type="number" placeholder="Quantity (L)" id={`qty-${index}`} />
              <Button onClick={() => {
                const qty = document.getElementById(`qty-${index}`).value;
                if (qty) addDailyEntry(index, qty);
              }}>Add Today’s Entry</Button>
            </div>
            <div className="text-sm text-gray-600">
              Total for month: {calculateMonthly(cust.logs)}L, ₹{calculateMonthly(cust.logs) * parseFloat(cust.price)}
            </div>
            <Button className="mt-2" onClick={() => generateReport(cust)}>
              Download Monthly Report
            </Button>
            <ul className="text-xs mt-2">
              {cust.logs.map((log, i) => (
                <li key={i}>{log.date} - {log.quantity}L</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
