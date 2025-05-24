#include <emscripten.h>

extern "C"
{

    EMSCRIPTEN_KEEPALIVE
    void multiplyMatrices(int *A, int *B, int *C, int n)
    {
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                int sum = 0;
                for (int k = 0; k < n; k++)
                {
                    sum += A[i * n + k] * B[k * n + j];
                }
                C[i * n + j] = sum;
            }
        }
    }
}
