/*
 * Author: Carson Lam
 */

let selectedSorter = 0;

let stopSorting = false;

let sorting = false;

const title = document.querySelector('.typewriter .maintext');

const output = document.querySelector('.outputText');

class Node {
    constructor(item) {
        this.item = item;
        this.next = null;
    }
}

//QUICK SORT, MERGE SORT IMPLEMENTATION
//USING LINKED LISTS
/******************************************************************************/
class SortableList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    //CREATE LINKED LIST
    /******************************************************************************/
    add(item) {
        const n = new Node(item);
        n.item = item;
        if (this.head == null) {
            this.head = this.tail = n;
        } else {
            n.next = this.head;
            this.head = n;
        }
    }

    //COMPARABLE METHODS
    /******************************************************************************/
    less(item1, item2) {
        return compareTo(item1, item2) < 0;
    }

    exch(n, m) {
        const tempItem = n.item;
        n.item = m.item;
        m.item = tempItem;
    }


    //QUICK SORT METHODS
    /******************************************************************************/
    //Makes the partitions during the sort
    async partition(lo, hi) {
        //Empty list case
        if (lo == null || hi == null || stopSorting) return null;

        //Establish low and hi of partition (Lomuto method)
        let i = lo;
        let previous = null;
        const pivot = hi; //Lomuto's partitioning places pivot at hi

        let swapped = false;

        for (let j = lo; j != hi; j = j.next) {
            if (stopSorting) return null;
            if (this.less(j.item, pivot.item)) {
                if (i !== j) {
                    this.exch(i, j);
                    console.log(this.toString());
                    document.getElementById("outputText").innerHTML = this.toString();
                    await delay(500);
                }
                previous = i;
                i = i.next;
            }
        }
        if (i !== pivot) {
            this.exch(i, pivot);
            console.log(this.toString());
            document.getElementById("outputText").innerHTML = this.toString();
            await delay(500);
        }
        return (previous == lo) ? null : previous;
    }

    async quickSort() {
        sorting = true;
        document.getElementById("outputText").innerHTML = "STARTING QUICK SORT";
        console.log("STARTING QUICK SORT");
        await delay(500);
        document.getElementById("outputText").innerHTML = "Input: " + this.toString();
        await delay(500);
        await this.sortNodes(this.head, this.tail);
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML = "QUICK SORT FINISHED";
        console.log("QUICK SORT FINISHED");
        await delay(500);
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML = "Output: " + this.toString();
        console.log("Output " + this.toString());
        sorting = false;
    }

    async sortNodes(lo, hi) {
        //Base case
        if (lo == null || lo == hi || lo == hi.next || stopSorting) return;

        //Partition and get pivot
        const pivot = await this.partition(lo, hi);
        if (pivot != null) await this.sortNodes(lo, pivot);
        if (pivot != null && pivot.next != null) {
            await this.sortNodes(pivot.next, hi);
        } else if (pivot == null) {
            await this.sortNodes(lo.next, hi);
        }
    }

    //MERGE SORT METHODS
    /******************************************************************************/
    async mergeSort() {
        sorting = true;
        document.getElementById("outputText").innerHTML = "STARTING MERGE SORT";
        await delay(500);
        document.getElementById("outputText").innerHTML = "Input: " + this.toString();
        await delay(500);
        this.head = await this.mergeSorter(this.head);
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML = "MERGE SORT FINISHED";
        console.log("MERGE SORT FINISHED");
        await delay(500);
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML = "Output: " + this.toString();
        console.log("Output: " + this.toString());
        sorting = false;
    }

    async mergeSorter(head) {
        if (stopSorting) return null;
        //Print list to be sorted
        if (!head || !head.next || stopSorting) {
            document.getElementById("outputText").innerHTML = this.partialToString(head);
            console.log(this.partialToString(head));
            await delay(400);
        } else {
            document.getElementById("outputText").innerHTML = this.partialToString(head);
            console.log(this.partialToString(head));
            await delay(500);
        }

        //Base Case
        if (!head || !head.next) return head;

        const mid = await this.getMiddle(head);
        const midNext = mid.next;
        mid.next = null;

        //Print two split halves
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML =
            "Split: &nbsp;&nbsp;&nbsp;" + this.partialToString(head) + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;" + this.partialToString(midNext);
        console.log(
            "Split: &nbsp;&nbsp;&nbsp;" + this.partialToString(head) + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;" + this.partialToString(midNext)
        );
        await delay(800);

        const left = await this.mergeSorter(head);
        const right = await this.mergeSorter(midNext);
        const leftStr = this.partialToString(left);
        const rightStr = this.partialToString(right);
        if (stopSorting) return null;
        const result = await this.merge(left, right);

        //Print merging halves 
        if (stopSorting) return null;
        document.getElementById("outputText").innerHTML =
            "Merge: &nbsp;&nbsp;&nbsp;" + leftStr + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;" + rightStr + "&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;" + this.partialToString(result);
        console.log(
            "Merge: &nbsp;&nbsp;&nbsp;" + leftStr + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;" + rightStr + "&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;" + this.partialToString(result)
        );
        await delay(800);

        //Print merged result
        return result;
    }

    async getMiddle(head) {
        if (head == null) return null;
        let mid = head;
        let end = head;
        while (end.next && end.next.next) {
            mid = mid.next;
            end = end.next.next;
        }
        return mid;
    }

    async merge(left, right) {
        //Base case
        if (!left) return right;
        if (!right) return left;

        if (this.less(left.item, right.item)) {
            left.next = await this.merge(left.next, right);
            return left;
        } else {
            right.next = await this.merge(left, right.next);
            return right;
        }

    }

    //DISPLAY METHODS
    /******************************************************************************/
    toString() {
        let s = "";
        let n = this.head;
        while (n !== null) {
            s += n.item;
            if (n.next !== null) {
                s += " -> "; // Only add "->" if there's a next node
            }
            n = n.next;
        }
        return s;
    }

    partialToString(node) {
        let s = "";
        for (let n = node; n !== null; n = n.next) {
            s += n.item + (n.next ? "->" : "");
        }
        return s;
    }

    async visualize() {
        const outputElement = document.getElementById("outputText");
        outputElement.innerHTML = this.toString();
        console.log(this.toString());
        await delay(500);
    }
}

//HEAPSORT IMPLEMENTATION (USING ARRAY)
/******************************************************************************/
class HeapSorter {
    constructor(){
        this.a = [];
    }

    less(v, w) {
        return compareTo(this.a[v-1],this.a[w-1]) < 0;

    }

    exch(n,m){
        const temp = this.a[n-1];
        this.a[n-1] = this.a[m-1];
        this.a[m-1] = temp;

    }

    sink(k, n){
        while(2*k<=n){
            let j = 2*k;
            if ((j<n) && (this.less(j,j+1))) j++;
            if (this.less(j,k)) break;
            this.exch(k,j);
            k = j;
        }
    }

    heapSorter(a) {
        this.a = a;
        let n = a.length;

        //Math.floor to ensure integer division in n/2 for odd values of n
        //In Java, int i ensures 3/2 = 1 when n=3
        for (let i = Math.floor(n / 2); i >= 1; i--){
            this.sink(i,n);
        }

        while (n > 1){
            this.exch(1, n--);
            this.sink(1,n);
        }
        
        return this.a;
    }

    heapSort(){
        this.a = this.heapSorter(this.a);
    }
}

// 
//HELPER METHODS
/******************************************************************************/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function convertStringToSortableList(str) {
    const list = new SortableList();
    for (const char of str) {
        list.add(char);
    }
    return list;
}

function compareTo(item1, item2) {
    if (typeof item1 === "string" || typeof item1 === "number") {
        return item1 < item2 ? -1 : item1 > item2 ? 1 : 0
    } else if (item1.compareTo && typeof item1.compareTo === "function") {
        return item1.compareTo(item2);
    }
    throw new Error("Cannot compare these two items.");
}

/* 
Test inputs:
hungry
3,4,1,9,5,3,8,4,5,3,12

// const sorter = new HeapSorter();
// const input = ['K','R','A','T','E','L','E','P','U','I','M','Q','C','X','O','S'];
// sorter.a = input;
// sorter.sort();
// console.log(input.toString());

*/


async function sortInput() {
    stopSorting = false;
    if (selectedSorter == 0) {

        //QUICK SORT
        /******************************************************************************/
        try {
            const input = document.getElementById('input').value;
            if (typeof input === "string") {
                //Number case
                if (input.includes(',')) {
                    const list = new SortableList();
                    const numbers = input.split(','); //list becomes array of sirings [num1, num2, num3]
                    for (const num of numbers) {
                        const numberValue = parseFloat(num.trim()); //Convert to number
                        if (!isNaN(numberValue)) list.add(numberValue); //Check if valid number and add to list
                    }
                    // await list.visualize();
                    await list.quickSort();
                }
                //String case
                else {
                    const list = convertStringToSortableList(input);
                    // await list.visualize();
                    await list.quickSort();
                }
            }
        } catch (error) {
            alert("Cannot sort this input!")
            console.error("Cannot sort this input: ", error);
        }
    } else if (selectedSorter == 1) {

        //MERGE SORT
        /******************************************************************************/
        try {
            const input = document.getElementById('input').value;
            if (typeof input === "string") {
                //Number case
                if (input.includes(',')) {
                    const list = new SortableList();
                    const numbers = input.split(','); //list becomes array of sirings [num1, num2, num3]
                    for (const num of numbers) {
                        const numberValue = parseFloat(num.trim()); //Convert to number
                        if (!isNaN(numberValue)) list.add(numberValue); //Check if valid number and add to list
                    }
                    await list.mergeSort();
                }
                //String case
                else {
                    const list = convertStringToSortableList(input);
                    await list.mergeSort();
                }
            }
        } catch (error) {
            alert("Cannot sort this input!")
            console.error("Cannot sort this input: ", error);
        }
    } else if (selectedSorter == 2) {
        
        //HEAP SORT
        /******************************************************************************/
        try {
            const input = document.getElementById('input').value;
            if (typeof input === "string") {
                //Number case
                if (input.includes(',')) {
                    const list = new HeapSorter();
                    const numbers = input.split(','); //list becomes array of sirings [num1, num2, num3]
                    for (const num of numbers) {
                        const numberValue = parseFloat(num.trim()); //Convert to number
                        if (!isNaN(numberValue)) list.add(numberValue); //Check if valid number and add to list
                    }
                    await list.heapSort();
                }
                //String case
                else {
                    const list = convertStringToSortableList(input);
                    await list.heapSort();
                }
            }
            
            // const sorter = new HeapSorter();
            // const input = ['K','R','A','T','E','L','E','P','U','I','M','Q','C','X','O','S'];
            // sorter.a = input;
            // sorter.sort();
            // console.log(input.toString());
        } catch (error) {
            alert("Cannot sort this input!")
            console.error("Cannot sort this input: ", error);
        }
    }
}
document.getElementById('inputForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!sorting) await sortInput();
    else return null;
});

document.getElementById('inputButton').addEventListener('click', async function (event) {
    event.preventDefault();
    if (!sorting) await sortInput();
    else return null;
});


document.getElementById('qsButton').addEventListener('click', function (event) {
    event.preventDefault();
    if (selectedSorter == 0) {
        return null;
    } else {
        //Reset Animation
        title.style.animation = 'none';
        title.textContent = 'QuickSorter';
        void title.offsetHeight; //Force reflow
        title.style.animation = '';

        //Reset output box
        stopSorting = true; //Triggers quitting condition in sorters
        sorting = false; //Sets sorting to false in case sorter interrupted and cannot set false at the end
        console.log("Sorting aborted!");
        output.textContent = 'Sorted output';

        //Set new sorter
        selectedSorter = 0;
        console.log(selectedSorter);
    }
});

document.getElementById('msButton').addEventListener('click', function (event) {
    event.preventDefault();

    if (selectedSorter == 1) {
        return null;
    } else {
        //Reset animation
        title.style.animation = 'none';
        title.textContent = 'MergeSorter';
        void title.offsetHeight; //Force reflow
        title.style.animation = '';

        //Reset output box
        stopSorting = true; //Triggers quitting condition in sorters
        sorting = false; //Sets sorting to false in case sorter interrupted and cannot set false at the end
        console.log("Sorting aborted!");
        output.textContent = 'Sorted output';

        //Set new sorter
        selectedSorter = 1;
        console.log(selectedSorter);
    }
});

document.getElementById('hsButton').addEventListener('click', function (event) {
    event.preventDefault();

    if (selectedSorter == 2) {
        return null;
    } else {
        //Reset animation
        title.style.animation = 'none';
        title.textContent = 'HeapSorter';
        void title.offsetHeight; //Force reflow
        title.style.animation = '';

        //Reset output box
        stopSorting = true; //Triggers quitting condition in sorters
        sorting = false; //Sets sorting to false in case sorter interrupted and cannot set false at the end
        console.log("Sorting aborted!");
        output.textContent = 'Sorted output';

        //Set new sorter
        selectedSorter = 2;
        console.log(selectedSorter);
    }
});
