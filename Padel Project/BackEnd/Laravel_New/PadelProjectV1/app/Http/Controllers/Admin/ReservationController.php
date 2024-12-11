<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Exception;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Requests\StoreCancellationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Mail\ReservationCompleted;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\Reservation;
use App\Models\Field;
use App\Models\Cancellation;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Recupera o ID do usuário autenticado
            $userId = auth()->id();
            // Recupera o usuário logado e verifica sua role
            $user = auth()->user();

            // Inicializa a variável para armazenar as reservas
            $reservations = [];

            // Verifica se o usuário tem a role de admin (role_id = 1)
            if ($user->role_id === 1) {
                // Se for admin, retorna todas as reservas com informações dos usuários associados
                $reservations = Reservation::with(['fields', 'user'])->get();
            } else {
                // Caso contrário, retorna apenas as reservas do usuário logado
                $reservations = Reservation::with('fields')->where('user_id', $userId)->get();
            }

            // Se não houver reservas, retorna uma mensagem informando
            if ($reservations->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhuma reserva encontrada.',
                    'reservations' => []
                ]);
            }

            // Prepara a resposta
            $response = [
                'reservations' => $reservations
            ];

            // Adiciona as informações do usuário apenas se for admin
            if ($user->role_id === 1) {
                $response['user'] = $user;
            }

            // Retorna as reservas (e informações do admin, se aplicável)
            return response()->json($response, 200);

        } catch (\Exception $exception) {
            // Caso haja erro, retorna uma mensagem de erro
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        try {
            // Validação dos dados recebidos
            $validatedData = $request->validated();
            $reservations = [];

            foreach ($validatedData['reservations'] as $reservationData) {
                // Extrai os IDs dos campos e remove da entrada principal
                $fields = $reservationData['fields'];
                unset($reservationData['fields']);

                // Adiciona informações adicionais obrigatórias
                $reservationData['user_id'] = auth()->id();
                $reservationData['status'] = $validatedData['status'];
                $reservationData['privacy_policy'] = $validatedData['privacy_policy'];

                // Converte as datas para o formato correto
                $reservationData['start_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['start_date'])->format('Y-m-d H:i:s');
                $reservationData['end_date'] = Carbon::createFromFormat('d/m/Y H:i', $reservationData['end_date'])->format('Y-m-d H:i:s');

                // Cria a reserva
                $reservation = Reservation::create($reservationData);

                $detailedFields = []; // Lista para armazenar os detalhes dos campos associados

                if (!empty($fields)) {
                    foreach ($fields as $fieldId) {
                        // Associa os campos à reserva na tabela pivot
                        $reservation->fields()->attach($fieldId, [
                            'start_date' => $reservationData['start_date'],
                            'end_date' => $reservationData['end_date']
                        ]);

                        // Obtém os detalhes do campo e da empresa
                        $field = Field::with('company')->find($fieldId);

                        if ($field) {
                            $pivotData = $reservation->fields()
                                ->where('fields.id', $fieldId)
                                ->first()
                                ->pivot;

                            // Adiciona os detalhes do campo e informações do pivot
                            $detailedFields[] = [
                                'field' => $field,
                                'pivot' => [
                                    'start_date' => $pivotData->start_date,
                                    'end_date' => $pivotData->end_date
                                ]
                            ];
                        }
                    }
                }

                // Adiciona os detalhes completos dos campos ao objeto de reserva
                $reservation->detailed_fields = $detailedFields;

                // Armazena a reserva na lista
                $reservations[] = $reservation;
            }

            // Se houver reservas, envia o e-mail ao usuário autenticado
            if (!empty($reservations)) {
                $user = auth()->user(); // Usuário autenticado
                $userEmail = $user->email;

                // Envia o e-mail com o Mailable
                Mail::to($userEmail)->send(new ReservationCompleted($reservations, $user));
            }

            // Retorna resposta de sucesso com as reservas criadas
            return response()->json([
                'status' => 'success',
                'message' => 'Reservas criadas com sucesso.',
              	'user' => $user,
                'reservations' => $reservations
            ], 201);

        } catch (\Exception $exception) {
            // Retorna erro em caso de exceção
            return response()->json([
                'error' => 'Erro ao criar as reservas: ' . $exception->getMessage()
            ], 500);
        }
    }

      /**
     * Display the specified resource.
     */
    public function show($reservationId)
    {

    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, $reservationId)
    {
            // Locate the reservation
            $reservation = Reservation::find($reservationId);

            // Check if the reservation exists
            if (!$reservation) {
                return response()->json(['error' => 'Reservation not found!'], 404);
            }

            // Validate the request data
            $validatedData = $request->validated();

            // Remove the 'fields' key from the validated data
            $reservationData = Arr::except($validatedData, ['fields']);

            // Update the reservation data
            $reservation->update($reservationData);

            // Sync the 'fields' relationship
            if ($request->has('fields')) {
                $reservation->fields()->sync($request->input('fields'));
            }

            // Fetch the updated reservation with its relationships
            $updatedReservation = Reservation::where('id', $reservation->id)->with('fields')->first();
        if(!$updatedReservation){ return response()->json(
            [
                'message' => 'Reserva não foi encontrada!'
            ], 404); }
        else
        {
            $updatedReservation->update($request->validated());
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'Reserva atualizada com sucesso!'
                ], 200);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StoreCancellationRequest $request, $reservationId)
    {
        try {
            // Localizar a reserva pelo ID
            $reservation = Reservation::find($reservationId);

            // Verificar se a reserva existe
            if (!$reservation) {
                return response()->json(['message' => 'Reserva não encontrada'], 404);
            }

            // Validar os dados do request
            $data = $request->validated();

            // Calcular o tempo restante para a reserva
            $reservationDate = Carbon::createFromFormat('d/m/Y H:i', $reservation->start_date);
            $todayDate = Carbon::now();
            $diff = $todayDate->diffInHours($reservationDate);
            $totalRefunded = $reservation->total;

            // Calcular o reembolso com base no tempo restante
            if ($diff <= 24) {
                $totalRefunded = 0; // Sem reembolso se faltar menos de 24h
            } elseif ($diff < 48) {
                $totalRefunded *= 0.5; // 50% de reembolso se faltar entre 24h e 48h
            }

            // Criar um registro de cancelamento antes de excluir a reserva
            $cancellation = Cancellation::create([
                'reservation_id' => $reservation->id,
                'reason' => $data['reason'] ?? null, // Aqui o motivo está sendo atribuído da requisição
                'total_refunded' => $totalRefunded,
                'status' => $data['status'] ?? 'Cancelada', // Status é opcional, então atribui 'Cancelada' se não vier
                'cancellation_date' => now(), // Registro automático do momento de cancelamento
            ]);

            // Excluir a reserva e os registros associados na tabela intermediária
            $reservation->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Reserva ' . $reservationId . ' eliminada com sucesso',
                'cancellation' => $cancellation,
            ], 200);

        } catch (\Exception $exception) {
            // Retornar erro em caso de exceção
            return response()->json([
                'status' => 'error',
                'message' => 'Erro a eliminar a reserva: ' . $exception->getMessage()
            ], 500);
        }
    }


    public function search($typeReservation = null)
    {

        try {
            //If something was sent in the route
            if ($typeReservation) {
                //Get all reservations that matches with the data sent
                $reservations = Reservation::where('address', 'LIKE', '%' . $typeReservation . '%')->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'reservations' => $reservations
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao procurar a reserva!',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function checkAvailability(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'start_date' => 'required|date_format:d/m/Y H:i:s',
                'end_date' => 'required|date_format:d/m/Y H:i:s',
                'field' => 'required|exists:fields,id',
            ]);

            // Converte as datas para o formato adequado e remove os segundos
            $startDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['start_date'])->setSecond(0);
            $endDate = Carbon::createFromFormat('d/m/Y H:i:s', $validatedData['end_date'])->setSecond(0);

            // Verifica se a reserva ultrapassa o mesmo dia
            if ($startDate->toDateString() !== $endDate->toDateString()) {
                return response()->json([
                    'available' => false,
                    'message' => 'Reservas não podem abranger mais de um dia.',
                ], 400); // Código 400: Solicitação inválida
            }

            // Obtém o dia da semana
            $dayOfWeek = strtolower($startDate->format('l')); // Exemplo: 'monday', 'tuesday'

            // Obter os horários de funcionamento do campo
            $field = Field::find($validatedData['field']);
            $schedule = $field->schedules()->where('day_of_week', $dayOfWeek)->first();

            if (!$schedule) {
                return response()->json([
                    'available' => false,
                    'message' => 'O campo não possui horários de funcionamento cadastrados para o dia selecionado.',
                ], 400); // Código 400: Solicitação inválida
            }

            // Verifica se o campo está fechado neste dia
            if ($schedule->is_closed) {
                return response()->json([
                    'available' => false,
                    'message' => 'O campo está fechado no dia selecionado.',
                ], 400); // Código 400: Solicitação inválida
            }

            // Converte os horários de funcionamento para objetos Carbon
            $openingTime = Carbon::parse($schedule->opening_time, $startDate->timezone)
                ->setDate($startDate->year, $startDate->month, $startDate->day);
            $closingTime = Carbon::parse($schedule->closing_time, $startDate->timezone)
                ->setDate($startDate->year, $startDate->month, $startDate->day);

            // Validação de horário
            if ($startDate->lt($openingTime) || $endDate->gt($closingTime)) {
                return response()->json([
                    'available' => false,
                    'message' => 'As datas selecionadas estão fora do horário de funcionamento do campo.',
                ], 400); // Código 400: Solicitação inválida
            }

            // Verifica conflitos de reservas
            $conflictingReservations = DB::table('field_reservation')
                ->where('field_id', $validatedData['field'])
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                          ->orWhereBetween('end_date', [$startDate, $endDate])
                          ->orWhere(function ($query) use ($startDate, $endDate) {
                              $query->where('start_date', '<=', $startDate)
                                    ->where('end_date', '>=', $endDate);
                          });
                })
                ->exists();

            if ($conflictingReservations) {
                return response()->json([
                    'available' => false,
                    'message' => 'Já existe uma reserva para as datas selecionadas.',
                ], 409); // Código 409: Conflito
            }

            return response()->json([
                'available' => true,
                'message' => 'As datas estão disponíveis.',
            ], 200); // Código 200: Sucesso
        } catch (\Exception $exception) {
            return response()->json([
                'error' => 'Erro ao verificar disponibilidade: ' . $exception->getMessage(),
            ], 500); // Código 500: Erro no servidor
        }
    }

}
