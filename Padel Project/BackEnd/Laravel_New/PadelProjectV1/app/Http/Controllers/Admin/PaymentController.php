<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Payments from table payments
        try
        {
            $payments = Payment::with('paymentMethod')->get();
            // If table Payment does not have any data echo a message, else show data
            if ($payments->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados.',
                    'payments'  => []
                ], 200);
            }
            else
            {
                return response()->json(
                    [
                        'payments' => $payments
                    ], 200);
            }
        }
        catch(\Exception $exception)
        {
            return response()->json(['error' => $exception], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //Not used, only for view
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        //Verify the data from request
        //validated() follows the StorePaymentRequest rules
        $validatedData = $request->validated();

        //Create a new payment with the verified data
        $payment = Payment::create($validatedData);
        return response()->json([
            'status' => 'success',
            'message' => 'Pagammento criado com sucesso!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //Search for the payment
        $payment = Payment::find($id);

        //If the payment does not exist show message error, else show payment
        if (!$payment) { return response()->json(
            [
                'message' => 'Pagamento não foi encontrado!'
            ], 404);
        }
        else
        {
            return response()->json(
                [
                    'payment' => $payment->load('paymentMethod')
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, $paymentId)
    {
        //Search for the Payment
        $payment = Payment::find($paymentId);
        //If the payment does not exist show message error else validate and update field data
        if(!$payment) { return response()->json(
            [
                'message' => 'Pagamento não foi encontrado!'
            ], 404);
        }
        else
        {
            $payment->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Pagamento atualizado com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($paymentId)
    {
        //Search for the Payment
        $payment = Payment::find($paymentId);
        //If the payment does not exist show message error
        if(!$payment){ return response()->json(
            [
                'message' => 'Pagamento não foi encontrado!'
            ], 404);
        }

        //Deletes payment and show message
        $payment->delete();
        return response()->json(
            [
                'message' => 'Pagamento eliminado com sucesso!'
            ]);
    }

    public function search($payment = null)
    {
        try {
            //If something was sent in the route
            if ($payment) {
                //Get all roles that matches with the data sent
                $payments = Payment::with('paymentMethod')
                    ->where('status', 'LIKE', '%' . $payment . '%')
                    ->orWhere('payment_date', 'LIKE', '%' . $payment . '%')
                    ->get();
            }

            // Return the search results
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'payments' => $payments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar o pagamento!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
