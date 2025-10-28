import { useState } from 'react';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';

const IngresosPage = () => {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ingresos</h2>
      <TransactionForm type="ingresos" onSuccess={() => setRefresh(r => r + 1)} />
      <TransactionList type="ingresos" key={refresh} />
    </div>
  );
};

export default IngresosPage;

