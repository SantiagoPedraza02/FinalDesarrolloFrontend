import { useState } from 'react';
import CategoryForm from '../components/CategoryForm.jsx';
import CategoryList from '../components/CategoryList.jsx';

const CategoriasPage = () => {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Categorias</h2>
      <CategoryForm onSuccess={() => setRefresh(r => r + 1)} />
      <CategoryList refreshKey={refresh} />
    </div>
  );
};

export default CategoriasPage;
