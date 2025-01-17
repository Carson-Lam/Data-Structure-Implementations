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
    partition(lo, hi) {
        //Empty list case
        if (lo == null | hi == null) return null;

        //Establish low and hi of partition (Lomuto method)
        let i = lo;
        let previous = null;
        const pivot = hi; //Lomuto's partitioning places pivot at hi

        for (let j = lo; j != hi; j = j.next) {
            if (this.less(j.item, pivot.item)) {
                this.exch(i, j);
                previous = i;
                i = i.next;
            }
        }
        this.exch(i, pivot);
        return (previous == lo) ? null : previous;
    }

    sort() {
        this.sortNodes(this.head, this.tail);
    }

    sortNodes(lo, hi) {
        if (lo == null || lo == hi || lo == hi.next) return;
        const pivot = this.partition(lo, hi);
        if (pivot != null) this.sortNodes(lo, pivot);
        if (pivot != null && pivot.next != null) {
            this.sortNodes(pivot.next, hi);
        } else if (pivot == null) {
            this.sortNodes(lo.next, hi);
        }
    }

    toString() {
        let s = "";
        let n = this.head;
        while (n !== null) {
            s += n.item;
            if (n.next !== null) {
                s += "->"; // Only add "->" if there's a next node
            }
            n = n.next;
        }
        return s;
    }
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
                list.sort();
                document.getElementById("outputText").innerHTML = list.toString();
                console.log(list.toString());
            } else {
                const list = convertStringToSortableList(input);
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