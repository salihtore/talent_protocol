module talent_protocol::talent;

use std::option::Option;
use std::string::String;
use talent_protocol::admin::AdminCap;

// === CONST's ===
const ETaskAlreadyClaimed: u64 = 0;
const ETaskAlreadyCompleted: u64 = 1;

// === STRUCTS ===
public struct Task has key, store {
    id: UID,
    title: String,
    description: String,
    reward: u64,
    worker: Option<address>,
    is_completed: bool,
}

// === FUNCTİONS ===
entry fun create_task(
    _: &AdminCap,
    title: String,
    description: String,
    reward: u64,
    ctx: &mut TxContext,
) {
    let new_task = Task {
        id: object::new(ctx),
        title,
        description,
        reward,
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
