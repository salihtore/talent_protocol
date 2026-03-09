"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
// import { Task } from '@/types'; // Eğer bu dosyada hata veriyorsa burayı yorum satırında bırakabilirsin. Biz any kullandık şimdilik.
import { formatAddress } from '@/lib/utils';
import { useTalentContract } from '@/hooks/useTalentContract';

interface TaskCardProps {
  task: any; // Task tipini şimdilik any yapıyoruz ki uyumsuzluk çıkmasın
  variants: any;
}

export default function TaskCard({ task, variants }: TaskCardProps) {
  const { applyForTask, completeTask, refundTask, currentAccount } = useTalentContract();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Cüzdan bağlayan kişinin adresi
  const userAddress = currentAccount?.address;
  // Görevi oluşturan kişi şu anki kullanıcı mı?
  const isCreator = userAddress === task.creator;

  const handleApply = async () => {
    try {
      setLoadingAction('apply');
      await applyForTask(task.id);
      alert("Göreve başarıyla başvurdunuz!");
      window.location.reload(); // Değişikliği anında görmek için sayfayı yenile
    } catch (error: any) {
      alert(`Hata oluştu: ${error.message || "Başvuru başarısız"}`);
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleComplete = async () => {
    try {
      setLoadingAction('complete');
      await completeTask(task.id);
      alert("Görev tamamlandı ve ödeme yapıldı!");
      window.location.reload();
    } catch (error: any) {
      alert(`Hata oluştu: ${error.message || "İşlem başarısız"}`);
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRefund = async () => {
    if(!confirm("Görevi iptal edip SUI'leri geri almak istediğinize emin misiniz?")) return;
    
    try {
      setLoadingAction('refund');
      await refundTask(task.id);
      alert("Görev iptal edildi, SUI cüzdanınıza iade edildi.");
      window.location.reload();
    } catch (error: any) {
      alert(`Hata oluştu: ${error.message || "İade başarısız"}`);
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brandBlue-500">
          {task.reward}
        </span>
        {task.isCompleted ? (
          <span className="text-green-500 flex items-center gap-1 text-sm font-medium">
            <CheckCircle size={18} /> Tamamlandı
          </span>
        ) : (
          <span className="text-orange-400 flex items-center gap-1 text-sm font-medium">
            <Clock size={18} /> Açık
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-navy-900 mb-2">{task.title}</h3>
      <p className="text-slate-600 text-sm mb-6 flex-grow">{task.description}</p>

      <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Oluşturan</p>
        <p className="text-sm font-mono text-navy-800 break-all mb-3">
          {task.creator ? formatAddress(task.creator) : "-"}
        </p>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Atanan Kişi</p>
        <p className="text-sm font-mono text-navy-800 break-all">
          {task.worker ? formatAddress(task.worker) : "Henüz kimse atanmadı"}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        {/* Herkes başvurabilir (Kendi görevi değilse) */}
        {!task.worker && !task.isCompleted && !isCreator && (
          <button 
            onClick={handleApply}
            disabled={loadingAction !== null}
            className="w-full py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-colors shadow-md disabled:opacity-50"
          >
            {loadingAction === 'apply' ? 'İşleniyor...' : 'Görevi Üstlen'}
          </button>
        )}

        {/* Görevi oluşturan kişi, kimse atanmadıysa iptal edebilir */}
        {!task.worker && !task.isCompleted && isCreator && (
            <button 
                onClick={handleRefund}
                disabled={loadingAction !== null}
                className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
            >
                {loadingAction === 'refund' ? 'İşleniyor...' : 'Görevi İptal Et (İade Al)'}
            </button>
        )}

        {/* Biri atandığında sadece Görevi Oluşturan kişi tamamlayabilir veya iptal edebilir */}
        {task.worker && !task.isCompleted && isCreator && (
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleComplete}
              disabled={loadingAction !== null}
              className="py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
            >
              {loadingAction === 'complete' ? 'İşleniyor...' : 'Tamamla'}
            </button>
            <button 
              onClick={handleRefund}
              disabled={loadingAction !== null}
              className="py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
            >
              {loadingAction === 'refund' ? 'İşleniyor...' : 'İptal Et'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}