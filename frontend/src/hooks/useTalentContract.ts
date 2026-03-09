import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../lib/constants'; // constants dosyasından sadece PACKAGE_ID'yi alıyoruz

export function useTalentContract() {
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();

    const createTask = async (title: string, description: string, paymentAmountSui: number) => {
        if (!currentAccount) throw new Error("Cüzdan bağlı değil!");
        const tx = new Transaction();
        const MIST_PER_SUI = 1_000_000_000;

        const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(paymentAmountSui * MIST_PER_SUI)]);

        tx.moveCall({
            // Modül adı 'talent' olarak güncellendi
            target: `${PACKAGE_ID}::talent::create_task`,
            arguments: [tx.pure.string(title), tx.pure.string(description), paymentCoin],
        });

        return await signAndExecuteTransaction({ transaction: tx });
    };

    const applyForTask = async (taskId: string) => {
        if (!currentAccount) throw new Error("Cüzdan bağlı değil!");
        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::talent::apply_for_task`,
            arguments: [tx.object(taskId)],
        });

        return await signAndExecuteTransaction({ transaction: tx });
    };

    const completeTask = async (taskId: string) => {
        if (!currentAccount) throw new Error("Cüzdan bağlı değil!");
        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::talent::complete_task`,
            arguments: [tx.object(taskId)],
        });

        return await signAndExecuteTransaction({ transaction: tx });
    };

    // YENİ: Kontrata eklediğimiz refund_task fonksiyonunu arayüze bağlıyoruz
    const refundTask = async (taskId: string) => {
        if (!currentAccount) throw new Error("Cüzdan bağlı değil!");
        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::talent::refund_task`,
            arguments: [tx.object(taskId)],
        });

        return await signAndExecuteTransaction({ transaction: tx });
    };

    return { createTask, applyForTask, completeTask, refundTask, currentAccount };
}