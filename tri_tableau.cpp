#include <emscripten.h>

extern "C"
{

    // --- Bubble Sort (Tri à bulles) ---
    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int *arr, int n)
    {
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // --- Quick Sort (Tri rapide) ---

    // Fonction utilitaire pour échanger deux éléments
    void swap(int *a, int *b)
    {
        int t = *a;
        *a = *b;
        *b = t;
    }

    // Fonction pour partitionner le tableau
    int partition(int *arr, int low, int high)
    {
        int pivot = arr[high]; // prendre le dernier élément comme pivot
        int i = (low - 1);

        for (int j = low; j <= high - 1; j++)
        {
            if (arr[j] < pivot)
            {
                i++;
                swap(&arr[i], &arr[j]);
            }
        }
        swap(&arr[i + 1], &arr[high]);
        return (i + 1);
    }

    // QuickSort récursif
    void quickSortRec(int *arr, int low, int high)
    {
        if (low < high)
        {
            int pi = partition(arr, low, high);

            quickSortRec(arr, low, pi - 1);
            quickSortRec(arr, pi + 1, high);
        }
    }

    // Fonction exportée pour WebAssembly
    EMSCRIPTEN_KEEPALIVE
    void quickSort(int *arr, int n)
    {
        quickSortRec(arr, 0, n - 1);
    }
}
