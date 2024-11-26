<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Promotions from table Promotion
        try
        {
            $promotions = Promotion::all();
            // If table Promotion does not have any data echo a message, else show data
            if ($promotions->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados.',
                    'promotions'     => []
                ], 200); }
            else
            {
                return response()->json(
                    [
                        'promotions' => $promotions
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
    public function store(StorePromotionRequest $request)
    {
        //Verify the data from request
        //validated() follows the StorePromotionRequest rules
        $validatedData = $request->validated();

        //Create a new promotion with the verified data
        $promotion = Promotion::create($validatedData);
        return response()->json([
            'message' => 'Promoção criada com sucesso!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($promotionId)
    {
        //Search for the promotion
        $promotion = Promotion::find($promotionId);
        //If the promotion does not exist show message error, else show promotion
        if (!$promotion) { return response()->json(
            [
                'message' => 'Promoção não foi encontrada!'
            ], 404); }
        else { return response()->json(
            [
                'promotion' => $promotion
            ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promotion $promotion)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePromotionRequest $request, $promotionId)
    {
        //Search for the Promotion
        $promotion = Promotion::find($promotionId);

        //If the promotion does not exist show message error, else validate and update promotion data
        if(!$promotion){
            return response()->json(
            [
                'message' => 'Promoção não foi encontrada!'
            ], 404);
        }

        $promotion->update($request->validated());
        return response()->json(
        [
            'message' => 'Promoção atualizada com sucesso!'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($promotionId)
    {
        //Search for the Promotion
        $promotion = Promotion::find($promotionId);
        //If the promotion does not exist, show message error
        if(!$promotion){
            return response()->json(
            [
                'message' => 'Promoção não foi encontrada!'
            ], 404);
        }

        if($promotion->active == true) {
            return response()->json(
            [
                'message' => 'Não pode eliminar uma promoção que ainda está ativa!'
            ], 404);
        }

        //Deletes promotion and show message
        $promotion->delete();
        return response()->json([
            'message' => 'Promoção eliminada com sucesso!'
        ]);
    }

    public function search($string = null)
    {
        try{
            //If something was sent in the route
            if ($string) {
                $promotions = Promotion::
                    where('description', 'LIKE', '%' . $string . '%')
                    ->orWhere('promo_code', 'LIKE', '%' . $string . '%')
                    ->get();
            }
            else { $promotions = Promotion::all(); }

            //Show all values that match with the search input
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'promotions' => $promotions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a promoção!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
