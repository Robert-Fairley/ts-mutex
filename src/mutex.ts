if (window) {
    window.exports = exports = {};
}
/**
 * The method/promise type to be added to the mutex queue.
 */
export type MutexTask = <T>(...args: unknown[]) => Promise<T | unknown>;

/**
 * Type for expressing the resolve/reject methods passed into a {@link MutexRecord}
 */
export type MutexFunction = (value?: unknown) => unknown;

/**
 * A mutex queue item
 */
export type MutexRecord = [MutexTask, MutexFunction, MutexFunction];

/**
 * Mutex class. Provides a queue and locking for concurrent method calls.
 */
class Mutex {
    private busy!: boolean;
    private readonly queue!: MutexRecord[];

    /** @constructor */
    public constructor() {
        this.busy = false;
        this.queue = [];
    }

    /**
     * Synchronizies a task within the locking mechanism. Task
     * is added to queue and fires when not 'busy' with a previously
     * synched task.
     * @param task A method/promise to enqueue
     * @public
     */
    public synchronize(task: MutexTask): Promise<unknown> {

        return new Promise((resolve, reject) => {
            this.queue.push([task, resolve, reject]);
            if (!this.busy)
                this.dequeue();
        });
    }

    /**
     * Removes the first item from the queue and executes the task,
     * otherwise releases the lock.
     * @private
     */
    private dequeue(): void {
        this.busy = true;
        const next = this.queue.shift();

        if (next) {
            this.execute(next);
        } else {
            this.busy = false;
        }
    }

    /**
     * Executes a given task in the queue.
     * @param record The mutex record to execute
     * @private
     */
    private execute(record: MutexRecord): void {
        const [task, resolve, reject] = record;

        task().then(resolve, reject).then(() => {
            this.dequeue();
        });
    }

    /**
     * CAUTION. Empties the entire queue without executing any
     * method.
     * @public
     */
    public emptyQueue(): void {
        for (let i = 0; i < this.queue.length; i++) {
            delete this.queue[i];
        }
        this.busy = false;
    }

    /**
     * Dumps the entire queue without affecting the lock or
     * executing any methods.
     * @public
     */
    public dumpQueue(): MutexRecord[] {
        return [...this.queue];
    }

    
}

if (window) {
    (window as any).Mutex = Mutex;
}
export { Mutex };
export default Mutex;
