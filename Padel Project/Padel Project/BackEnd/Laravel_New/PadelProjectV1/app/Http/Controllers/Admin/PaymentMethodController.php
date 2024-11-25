<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentMethodRequest;
use App\Http\Requests\UpdatePaymentMethodRequest;
use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all PaymentMethods from table Address
        try
        {
            $paymentMethods = PaymentMethod::withCount('payments')->get();
            // If table PaymentMethods does not have any data echo a message, else show data
            if ($paymentMethods->isEmpty()) { return response()->json(
                [
                    'message'           => 'Esta lista ainda não contém dados.',
                    'payment_methods'   => []
                ], 200); }
            else { return response()->json($paymentMethods, 200); }
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
    public function store(StorePaymentMethodRequest $request)
    {
        //Verify the data from request
        // validated() follows the StorePaymentMethodRequest rules
        $validatedData = $request->validated();

        // Create a new payment method with the verified data
        $payment_method = PaymentMethod::create($validatedData);

        // Return a response with the payment method created
        return response()->json([
            'message' => 'Método pagamento criado com sucesso!',
            'payment_method' => $payment_method
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($paymentMethodId)
    {
        //Search for the paymentMethod
        $paymentMethod = PaymentMethod::withCount('payments')->find($paymentMethodId);

        //If the payment method does not exist show message error, else show payment method
        if (!$paymentMethod) { return response()->json(
            [
                'message' => 'Método de pagamento não foi encontrado!'
            ], 404);
        }
        else
        {
            return response()->json(
                [
                    'payment_method' => $paymentMethod
                ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentMethod $paymentMethod)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentMethodRequest $request, $paymentMethodId)
    {
        //Search for the Payment Method
        $paymentMethod = PaymentMethod::withCount('payments')->find($paymentMethodId);
        //If the payment method does not exist show message error else validate and update payment method data
        if(!$paymentMethod){ return response()->json(
            [
                'message' => 'Método de pagamento não foi encontrado!'
            ], 404);
        }
        else
        {
            $paymentMethod->update($request->validated());
            return response()->json(
                [
                    'message' => 'Método de pagamento '.$paymentMethod->name.' atualizado com sucesso!'
                ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($paymentMethodId)
    {
        //Search for the Payment Method
        $paymentMethod = PaymentMethod::find($paymentMethodId);
        //If the payment method does not exist show message error
        if(!$paymentMethod){ return response()->json(
            [
                'message' => 'Método de pagamento não foi!'
            ], 404); }

        //Get how many payments are associates do this payment method
        $paymentsCount = $paymentMethod->payments->count();

        //If there are payments associated we cant delete
        if ($paymentsCount > 0) {
            return response()->json([
                'message' => 'Não é possível eliminar este método de pagamento. Tem '.$paymentsCount.' associados.'
            ], 400);
        }

        //Deletes payment method and show message with payment method deleted
        $paymentMethod->delete();
        return response()->json([
            'message' => 'Método de pagamento '. $paymentMethod->name .' apagado com sucesso!'
        ]);
    }

    public function search($description = null)
    {
        try{
            //If something was sent in the route
            if ($description) {
                $paymentMethods = PaymentMethod::withCount('payments')
                    ->where('description', 'like', '%' . $description . '%')
                    ->get();
            } else {
                $paymentMethods = PaymentMethod::all();
            }

            //Show message if the search does not return any results
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'payment_methods' => $paymentMethods
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar o método de pagamento!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
