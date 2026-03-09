"use client";

import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import TaskCard from './TaskCard';
import { PACKAGE_ID } from '@/lib/constants'; // Paket ID'mizi import ettik

export default function TaskBoard() {
  const client = useSuiClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Başlangıçta true yapıyoruz

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        // 1. Ağdaki 'TaskCreatedEvent' eventlerini bul
        const events = await client.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::talent::TaskCreatedEvent`,
          },
          order: 'descending', // En yeni görevler en üstte
        });

        // Eventlerden dönen hiçbir şey yoksa çık
        if (events.data.length === 0) {
          setTasks([]);
          return;
        }

        // 2. Eventlerin içinden Görev ID'lerini ayıkla
        const taskIds = events.data.map((event: any) => event.parsedJson.task_id);

        // 3. Bulunan Görev ID'lerinin güncel verisini Sui ağından çek
        const response = await client.multiGetObjects({
          ids: taskIds,
          options: { showContent: true },
        });

        // 4. Gelen veriyi UI'a uygun hale getir
        const formattedTasks = response
          .filter((res) => res.data) // Silinmiş objeleri filtrele
          .map((res: any) => {
            const data = res.data?.content?.fields;
            return {
              id: res.data?.objectId,
              title: data?.title,
              description: data?.description,
              reward: `${Number(data?.reward) / 1_000_000_000} SUI`, // MIST -> SUI
              creator: data?.creator,
              worker: data?.worker, 
              isCompleted: data?.is_completed,
            };
          });

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Görevler çekilirken hata:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [client]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Açık Görevler (Sui Ağı)</h2>

      {loading && (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandBlue-500"></div>
            <span className="ml-3 text-slate-500 font-medium">Ağdan görevler taranıyor...</span>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">Henüz ağda listelenen görev yok.</p>
            <p className="text-slate-400 text-sm mt-1">Yukarıdan yeni bir görev oluşturun.</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}