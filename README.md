#  Talent Protocol (Decentralized Task Board on Sui)

A decentralized talent and task management protocol built on the **Sui Blockchain**. This application allows users to create tasks, lock SUI as a reward, apply for open tasks, and get paid automatically upon completion.

##  Features

* **Create Tasks:** Anyone can create a task by providing a title, description, and locking a specific SUI amount as a reward.
* **Apply for Tasks:** Users can browse the task board and apply to open tasks (except their own).
* **Complete & Pay:** Task creators can mark a task as completed, which automatically transfers the locked SUI to the assigned worker.
* **Refund & Cancel:** If no one is assigned or the task is no longer needed, the creator can cancel the task and securely refund their locked SUI.
* **Real-time Event Tracking:** The frontend dynamically fetches `TaskCreatedEvent`s from the Sui network to display active tasks.

##  Tech Stack

* **Smart Contract:** Sui Move
* **Frontend:** Next.js (App Router), React, TypeScript
* **Styling & UI:** Tailwind CSS, Framer Motion, Lucide React
* **Web3 Integration:** `@mysten/dapp-kit`, `@mysten/sui.js`

---

##  Quick Start

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer)
* [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed and configured
* A Sui wallet extension (e.g., Sui Wallet) installed in your browser

### 2. Smart Contract Setup
Navigate to the move contract folder and publish the package to the Sui network (Testnet/Devnet):

```bash
cd move_contract_folder
sui client publish --gas-budget 100000000

Note down the Package ID from the transaction output.

3. Frontend Setup
Navigate to the frontend folder and install dependencies:
    cd frontend
    npm install

Update your PACKAGE_ID in the configuration file (e.g., src/lib/constants.ts):
    export const PACKAGE_ID = "YOUR_PUBLISHED_PACKAGE_ID_HERE";

Start the development server:
    npm run dev


📜 Smart Contract Overview
The core Move module talent_protocol::talent includes the following entry functions:

create_task(title: String, description: String, payment: Coin<SUI>, ctx: &mut TxContext): Creates a new shared Task object and emits a TaskCreatedEvent.

apply_for_task(task: &mut Task, ctx: &mut TxContext): Assigns the sender as the worker (cannot apply to own task).

complete_task(task: &mut Task, ctx: &mut TxContext): Completes the task and transfers the SUI reward to the worker.

refund_task(task: &mut Task, ctx: &mut TxContext): Cancels the task and refunds SUI to the creator.