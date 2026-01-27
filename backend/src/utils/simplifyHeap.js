// Max Heap helpers
function upheapify(heap, idx) {
  if (idx === 0) return;
  const parent = Math.floor((idx - 1) / 2);

  if (heap[parent].amount < heap[idx].amount) {
    [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
    upheapify(heap, parent);
  }
}

function downheapify(heap, idx) {
  const left = 2 * idx + 1;
  const right = 2 * idx + 2;

  let largest = idx;

  if (left < heap.length && heap[left].amount > heap[largest].amount)
    largest = left;

  if (right < heap.length && heap[right].amount > heap[largest].amount)
    largest = right;

  if (largest !== idx) {
    [heap[largest], heap[idx]] = [heap[idx], heap[largest]];
    downheapify(heap, largest);
  }
}

function pushHeap(heap, amount, userId) {
  heap.push({ amount, userId });
  upheapify(heap, heap.length - 1);
}

function popHeap(heap) {
  if (heap.length === 0) return null;

  [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];
  const top = heap.pop();
  downheapify(heap, 0);

  return top;
}

export function minimiseCashFlow(transactions) {
  const netBalance = {};

  // Step 1: Calculate net balances
  for (let t of transactions) {
    const from = t.fromUserId.toString();
    const to = t.toUserId.toString();

    netBalance[from] = (netBalance[from] || 0) - t.amount;
    netBalance[to] = (netBalance[to] || 0) + t.amount;
  }

  const positive = [];
  const negative = [];

  // Step 2: Build heaps
  for (let user in netBalance) {
    if (netBalance[user] > 0) {
      pushHeap(positive, netBalance[user], user);
    } else if (netBalance[user] < 0) {
      pushHeap(negative, -netBalance[user], user);
    }
  }

  // Step 3: Simplify
  const result = [];

  while (positive.length && negative.length) {
    const creditor = popHeap(positive);
    const debtor = popHeap(negative);

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    result.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amount: settleAmount,
    });

    if (creditor.amount > debtor.amount) {
      pushHeap(positive, creditor.amount - debtor.amount, creditor.userId);
    } else if (debtor.amount > creditor.amount) {
      pushHeap(negative, debtor.amount - creditor.amount, debtor.userId);
    }
  }

  return result;
}
