module talent_protocol::talent;

use std::option::Option;
use std::string::String;
use talent_protocol::admin::AdminCap;
use sui::balance::{Self, Balance};
use sui::sui::SUI;
use sui::coin::{Self, Coin};

// === CONST's ===
const ETaskAlreadyClaimed: u64 = 0;
const ETaskAlreadyCompleted: u64 = 1;
const ENoWorkerAssigned: u64 = 2;

// === STRUCTS ===
public struct Task has key, store {
    id: UID,
    title: String,
    description: String,
    reward: Balance<SUI>,
    worker: Option<address>,
    is_completed: bool,
}

// === FUNCTİONS ===
entry fun create_task(
    _: &AdminCap,
    title: String,
    description: String,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let new_task = Task {
        id: object::new(ctx),
        title,
        description,
        reward: coin::into_balance(payment),
        worker: option::none(),
        is_completed: false,
    };

    transfer::share_object(new_task);
}

entry fun apply_for_task(task: &mut Task, ctx: &mut TxContext) {
    let sender_address = tx_context::sender(ctx);
    assert!(option::is_none(&task.worker), ETaskAlreadyClaimed);
    assert!(!task.is_completed, ETaskAlreadyCompleted);
    option::fill(&mut task.worker, sender_address);
}

entry fun complete_task(
    _: &AdminCap,
    task: &mut Task,
    ctx: &mut TxContext
){
    assert!(!task.is_completed, ETaskAlreadyCompleted);
    assert!(option::is_some(&task.worker), ENoWorkerAssigned);
    task.is_completed = true;
    let worker_address = option::extract(&mut task.worker);
    let amount = balance::value(&task.reward); 
    let payment_balance = balance::split(&mut task.reward, amount); 
    let payment_coin = coin::from_balance(payment_balance, ctx); 
    transfer::public_transfer(payment_coin, worker_address);

}

entry fun refund_task(
    _: &AdminCap,
    task: &mut Task,
    ctx: &mut TxContext
){
    assert!(!task.is_completed, ETaskAlreadyCompleted);

    let amount = balance::value(&task.reward);
    assert!(amount > 0, 0);

    let refund_balance = balance::split(&mut task.reward, amount);
    let refund_coin = coin::from_balance(refund_balance, ctx);

    if (option::is_some(&task.worker)) {
        option::extract(&mut task.worker);
    };

    transfer::public_transfer(refund_coin, tx_context::sender(ctx));
}