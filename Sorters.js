/*
 * Author: Carson Lam
 */

class Node {
    constructor(item) {
        this.item = item;
        this.next = null;
    }
}



class SortableList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
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

    compareTo(item1, item2) {
        if (typeof item1 === "string" || typeof item1 === "number") {
            return item1 < item2 ? -1 : item1 > item2 ? 1 : 0
        } else if (item1.compareTo && typeof item1.compareTo === "function") {
            return item1.compareTo(item2);
        }
        throw new Error("Cannot compare these two items.");
    }

    less(item1, item2) {
        return this.compareTo(item1, item2) < 0;
    }

    exch(n, m) {
        const tempItem = n.item;
        n.item = m.item;
        m.item = tempItem;
    }

    //Makes the partitions during the sort
    async partition(lo, hi) {
        //Empty list case
        if (lo == null | hi == null) return null;

        //Establish low and hi of partition (Lomuto method)
        let i = lo;
        let previous = null;
        const pivot = hi; //Lomuto's partitioning places pivot at hi

        let swapped = false;

        for (let j = lo; j != hi; j = j.next) {
            if (this.less(j.item, pivot.item)) {
                if(i !== j){
                    this.exch(i,j);
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

    async sort() {
        this.sortNodes(this.head, this.tail);
    }

    async sortNodes(lo, hi) {
        //Base case
        if (lo == null || lo == hi || lo == hi.next) return;

        //Partition and get pivot
        const pivot = await this.partition(lo, hi);
        if (pivot != null) await this.sortNodes(lo, pivot);
        if (pivot != null && pivot.next != null) {
            await this.sortNodes(pivot.next, hi);
        } else if (pivot == null) {
            await this.sortNodes(lo.next, hi);
        }
    }

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
    async visualize() {
        const outputElement = document.getElementById("outputText");
        outputElement.innerHTML = this.toString();
        console.log(this.toString());
        await delay(500);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* 
Test inputs:
hungry
3,4,1,9,5,3,8,4,5,3,12
*/
function convertStringToSortableList(str) {
    const list = new SortableList();
    for (const char of str) {
        list.add(char);
    }
    return list;
}

document.getElementById('inputForm').addEventListener('submit', async function (event) {
    event.preventDefault();
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
                await list.visualize();
                list.sort();
                document.getElementById("outputText").innerHTML = list.toString();
                console.log(list.toString());
            } else {
                const list = convertStringToSortableList(input);
                await list.visualize();
                list.sort();
                document.getElementById("outputText").innerHTML = list.toString();
                console.log(list.toString());
            }
        }
    } catch (error) {
        alert("Cannot sort this input!")
        console.error("Cannot sort this input: ", error);
    }
});

document.getElementById('msButton').addEventListener('click', async function (event) {
    event.preventDefault();
});