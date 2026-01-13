/*
Understanding the Throw/Catch Mechanism
 - When JavaScript executes a throw statement, it immediately stops running the current function and skips any remaining code. The engine then searches up the call stack for a try...catch block that can handle the error.
 - JavaScript checks each calling function in order (like plates stacked on top of each other).
 - If a function has a try...catch, the error is caught and execution continues in the catch block.
 - If no handler is found, the error reaches the global scope and causes an uncaught exception. 
 */
