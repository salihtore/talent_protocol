module talent_protocol::talent;

use std::string::String;
use std::option::{Self, Option}; 
use sui::balance::{Self, Balance};
use sui::sui::SUI;
use sui::coin::{Self, Coin};
use sui::tx_context::{Self, TxContext};
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::event; 

// === CONST's ===
const ETaskAlreadyClaimed: u64 = 0;
const ETaskAlreadyCompleted: u64 = 1;
const ENoWorkerAssigned: u64 = 2;
const ENotTaskCreator: u64 = 3; 
const ECannotApplyForOwnTask: u64 = 4; 

// === EVENTS ===
public struct TaskCreatedEvent has copy, drop {
    task_id: ID,
    creator: address,
}

// === STRUCTS ===
public struct Task has key, store {
    id: UID,
    title: String,
    description: String,
    reward: Balance<SUI>,
    creator: address, 
    worker: Option<address>,
    is_completed: bool,
}

// === FUNCTIONS ===

entry fun create_task(
    title: String,
    description: String,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let creator_address = tx_context::sender(ctx);
    
    let task_uid = object::new(ctx);
    let task_id = object::uid_to_inner(&task_uid);

    let new_task = Task {
        id: task_uid,
        title,
        description,
        reward: coin::into_balance(payment),
        creator: creator_address, 
        worker: option::none(),
        is_completed: false,
    };

    event::emit(TaskCreatedEvent {
        task_id,
        creator: creator_address,
    });

    transfer::share_object(new_task);
}

entry fun apply_for_task(task: &mut Task, ctx: &mut TxContext) {
    let sender_address = tx_context::sender(ctx);
    
    assert!(sender_address != task.creator, ECannotApplyForOwnTask); 
    assert!(option::is_none(&task.worker), ETaskAlreadyClaimed);
    assert!(!task.is_completed, ETaskAlreadyCompleted);
    
    option::fill(&mut task.worker, sender_address);
}

entry fun complete_task(
    task: &mut Task,
    ctx: &mut TxContext
){
    assert!(tx_context::sender(ctx) == task.creator, ENotTaskCreator);
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
    task: &mut Task,
    ctx: &mut TxContext
){
    assert!(tx_context::sender(ctx) == task.creator, ENotTaskCreator);
    assert!(!task.is_completed, ETaskAlreadyCompleted);

    let amount = balance::value(&task.reward);
    assert!(amount > 0, 0); 

    let refund_balance = balance::split(&mut task.reward, amount);
    let refund_coin = coin::from_balance(refund_balance, ctx);

    if (option::is_some(&task.worker)) {
        let _ = option::extract(&mut task.worker); 
    };

    transfer::public_transfer(refund_coin, tx_context::sender(ctx));
}