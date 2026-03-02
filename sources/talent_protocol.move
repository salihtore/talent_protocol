module talent_protocol::talent;


// === İMPORTS ===
use std::option::Option;
use std::string::String;
use talent_protocol::admin::AdminCap;


// === STRUCTS ===
public struct Task has key, store{
    id: UID,
    title: String,
    description: String,
    reward: u64,
    worker: Option<address>,
    is_completed: bool
}

// === FUNCTİONS ===
entry fun create_task(
    _: &AdminCap,
    title: String,
    description:String,
    reward: u64,
    ctx: &mut TxContext){
        let new_task = Task{
            id: object::new(ctx),
            title,
            description,
            reward,
            worker: option::none(),
            is_completed: false
        };

        transfer::share_object(new_task);

}
