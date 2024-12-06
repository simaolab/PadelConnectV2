<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Auth;

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

    // Cria um SetupIntent, caso necessário para métodos de pagamento salvos
    public function createSetupIntent()
    {
        $user = Auth::user();
        return response()->json([
            'intent' => $user->createSetupIntent(),
        ]);
    }

    public function showPaymentForm()
    {
        $user = Auth::user();
        return view('payment', [
            'intent' => $user->createSetupIntent(),
        ]);
    }

    public function createPaymentIntent(Request $request)
    {
        $validatedData = $request->validate([
            'cardNumber'      => 'required|string|max:16',
            'cvv'             => 'required|string|max:4',
            'cardExpiry'      => 'required|string',
            'cardHolderName'  => 'required|string|max:255',
            'paymentMethod'   => 'required|string',
            'amount'          => 'required|numeric|min:1',
        ]);

        $stripe = new StripeClient(env('STRIPE_SECRET'));

        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $request->input('amount') * 100, // em centavos
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        // Cria o registro de pagamento no banco com status pending
        $payment = Payment::create([
            'amount' => $request->input('amount'),
            'status' => 'pending',
            'payment_method_id' => 1, // Ajuste conforme necessário
            'stripe_payment_intent_id' => $paymentIntent->id,
            'payment_date' => null
        ]);

        return response()->json([
            'status'         => 'success',
            'paymentIntentId'=> $paymentIntent->id,
            'clientSecret'   => $paymentIntent->client_secret,
        ]);
    }

    public function processPayment(Request $request)
    {
        $user = $request->user();
        $paymentMethod = $request->input('payment_method');
        $amount = $request->input('amount') * 100;

        try {
            $user->createOrGetStripeCustomer();
            $user->addPaymentMethod($paymentMethod);
            $user->charge($amount, $paymentMethod);
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function showPaymentIntent($id)
    {
        try {
            $stripe = new StripeClient(env('STRIPE_SECRET'));
            $paymentIntent = $stripe->paymentIntents->retrieve($id);

            return response()->json([
                'status'        => 'success',
                'paymentIntent' => $paymentIntent
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function confirmPaymentIntent($id)
    {
        try {
            $stripe = new StripeClient(env('STRIPE_SECRET'));
            $paymentIntent = $stripe->paymentIntents->confirm($id);

            $status = $paymentIntent->status;

            if ($status === 'requires_action') {
                return response()->json([
                    'status'         => 'requires_action',
                    'message'        => 'O pagamento requer mais ação do cliente.',
                    'paymentIntent'  => $paymentIntent,
                ]);
            } elseif ($status === 'succeeded') {
                // Atualiza o pagamento para status 'paid'
                $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
                if ($payment) {
                    $payment->status = 'paid';
                    $payment->payment_date = now()->format('d/m/Y');
                    $payment->save();
                }

                return response()->json([
                    'status'        => 'success',
                    'message'       => 'Pagamento bem-sucedido.',
                    'paymentIntent' => $paymentIntent,
                ]);
            } else {
                return response()->json([
                    'status'        => 'pending',
                    'message'       => 'Pagamento pendente.',
                    'paymentIntent' => $paymentIntent,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function handleWebhook(Request $request)
    {
        $signature = $request->header('Stripe-Signature');
        $payload = $request->getContent();

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                env('STRIPE_WEBHOOK_SECRET')
            );

            if ($event->type === 'payment_intent.succeeded') {
                $paymentIntent = $event->data->object;

                // Atualiza o pagamento para 'paid'
                $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
                if ($payment) {
                    $payment->status = 'paid';
                    $payment->payment_date = now()->format('d/m/Y');
                    $payment->save();
                }

                // Caso exista reserva vinculada, atualize também a reserva.
                // Exemplo:
                // $reservation = Reservation::where('stripe_payment_intent_id', $paymentIntent->id)->first();
                // if($reservation) {
                //     $reservation->status = 'confirmed';
                //     $reservation->save();
                // }
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}