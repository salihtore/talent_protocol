"use client";

import { useState } from 'react';
import { useTalentContract } from '@/hooks/useTalentContract';

export default function CreateTaskForm() {
  const { createTask, currentAccount } = useTalentContract();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [reward, setReward] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) return alert("Lütfen önce cüzdanınızı bağlayın!");
    
    try {
      setIsLoading(true);
      const res = await createTask(title, desc, Number(reward));
      alert(`Görev Başarıyla Oluşturuldu! İşlem Digest: ${res.digest}`);
      setTitle(''); setDesc(''); setReward('');
    } catch (error) {
      console.error(error);
      alert("Görev oluşturulurken hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentAccount) return null;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
      <h3 className="text-xl font-bold text-navy-900 mb-4">Yeni Görev Oluştur</h3>
      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
        <input 
          type="text" placeholder="Görev Başlığı" value={title} onChange={e => setTitle(e.target.value)} required
          className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-brandBlue-500"
        />
        <input 
          type="text" placeholder="Açıklama" value={desc} onChange={e => setDesc(e.target.value)} required
          className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-brandBlue-500"
        />
        <input 
          type="number" placeholder="Ödül (SUI)" value={reward} onChange={e => setReward(e.target.value)} required
          className="w-full md:w-32 p-3 border border-slate-200 rounded-xl focus:outline-brandBlue-500"
        />
        <button 
          type="submit" disabled={isLoading}
          className="bg-brandBlue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brandBlue-400 disabled:opacity-50"
        >
          {isLoading ? 'Yükleniyor...' : 'Oluştur'}
        </button>
      </form>
    </div>
  );
}