<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Models\Field;

class FieldController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Try to get all Fields from table Field
        try
        {
            $fields = Field::with('company')->get();
            // If table Field does not have any data echo a message, else show data
            if ($fields->isEmpty()) { return response()->json(
                [
                    'message'   => 'Esta lista ainda não contém dados.',
                    'fields'     => []
                ], 200); }
            else
            {
                return response()->json(
                    [
                        'fields' => $fields
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
	public function store(StoreFieldRequest $request)
    {
          // Validação dos dados recebidos
          $validated = $request->validated();

          $filePath = null;
          if ($request->hasFile('file_path')) {
              $filePath = $this->uploadFile($request->file('file_path')); // Chama a função de upload
          }

          // Criação do Field usando Eloquent (com o método create())
          $field = Field::create([
              'name' => $validated['name'],
              'price_hour' => $validated['price_hour'],
              'company_id' => $validated['company_id'],
              'type_floor' => $validated['type_floor'],
              'illumination' => $validated['illumination'],
              'cover' => $validated['cover'],
              'shower_room' => $validated['shower_room'],
              'lockers' => $validated['lockers'],
              'rent_equipment' => $validated['rent_equipment'],
              'status' => $validated['status'],
              'last_maintenance' => $validated['last_maintenance'],
              'file_path' => $filePath
          ]);

          // Agora que o Field foi criado, obtemos o ID do campo
          $fieldId = $field->id;
            if (!isset($validated['schedules'])) {
          		return response()->json(['error' => 'Horários não foram fornecidos.'], 400);
      		}

          // Define horários para os dias úteis (segunda a sexta-feira)
          $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          foreach ($weekdays as $day) {
              DB::table('field_schedule')->updateOrInsert(
                  ['field_id' => $fieldId, 'day_of_week' => $day],
                  [
                      'opening_time' => $validated['schedules']['weekdays']['opening_time'],
                      'closing_time' => $validated['schedules']['weekdays']['closing_time'],
                      'is_closed' => $validated['schedules']['weekdays']['is_closed'],
                      'updated_at' => now(),
                  ]
              );
          }

          // Define horário para sábado
          DB::table('field_schedule')->updateOrInsert(
              ['field_id' => $fieldId, 'day_of_week' => 'saturday'],
              [
                  'opening_time' => $validated['schedules']['saturday']['opening_time'],
                  'closing_time' => $validated['schedules']['saturday']['closing_time'],
                  'is_closed' => $validated['schedules']['saturday']['is_closed'],
                  'updated_at' => now(),
              ]
          );

          // Define horário para domingo
          DB::table('field_schedule')->updateOrInsert(
              ['field_id' => $fieldId, 'day_of_week' => 'sunday'],
              [
                  'opening_time' => $validated['schedules']['sunday']['opening_time'],
                  'closing_time' => $validated['schedules']['sunday']['closing_time'],
                  'is_closed' => $validated['schedules']['sunday']['is_closed'],
                  'updated_at' => now(),
              ]
          );

          return response()->json([
            'status' => 'success',
            'message' => 'Campo e horários criados com sucesso!']);
    }

    private function uploadFile($file)
    {
      $filePath = $file->store('fields', 'public');

      return $filePath;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['error' => 'Campo não encontrado'], 404);
        }

        // Pegando os horários
        $schedules = $field->schedules;

        // Filtrando horários
        $weekdays = $schedules->whereIn('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
            ->map(function ($schedule) {
                return [
                    'day_of_week' => $schedule->day_of_week,
                    'opening_time' => $schedule->opening_time,
                    'closing_time' => $schedule->closing_time,
                ];
            });

        $saturday = $schedules->where('day_of_week', 'saturday')->first();
        $sunday = $schedules->where('day_of_week', 'sunday')->first();

        // Organizando a resposta
        $response = [
            'field' => [
                'id' => $field->id,
                'name' => $field->name,
                'price_hour' => $field->price_hour,
                'type_floor' => $field->type_floor,
                'illumination' => $field->illumination,
                'status' => $field->status,
                'cover' => $field->cover,
                'last_maintenance' => $field->last_maintenance,
                'shower_room' => $field->shower_room,
                'lockers' => $field->lockers,
                'rent_equipment' => $field->rent_equipment,
              	'file_path' => $field->file_path ? asset('storage/' . $field->file_path) : null,
                'company' => [
                    'id' => $field->company->id,
                    'address' => $field->company->address,
                    'name' => $field->company->name,
                ],
            ],
            'schedules' => [
                'weekdays' => $weekdays->values(),
                'saturday' => $saturday ? [
                    'is_closed' => $saturday->is_closed,
                    'opening_time' => $saturday->is_closed == 0 ? $saturday->opening_time : null,
                    'closing_time' => $saturday->is_closed == 0 ? $saturday->closing_time : null,
                ] : null,
                'sunday' => $sunday ? [
                    'is_closed' => $sunday->is_closed,
                    'opening_time' => $sunday->is_closed == 0 ? $sunday->opening_time : null,
                    'closing_time' => $sunday->is_closed == 0 ? $sunday->closing_time : null,
                ] : null,
            ]
        ];

        return response()->json($response);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Field $field)
    {
        //Not used, only for view
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFieldRequest $request, $fieldId)
    {
        try {

            // Buscar o campo pelo ID
            $field = Field::find($fieldId);

            if (!$field) {
                return response()->json([
                    'message' => 'Campo não foi encontrado!'
                ], 404);
            }

            // Validar os dados enviados
            $validated = $request->validated();

            // Verificar se há arquivo para upload
            $filePath = $field->file_path;
            if ($request->hasFile('file_path')) {
                $filePath = $this->uploadFile($request->file('file_path'));
            }

            // Atualizar os dados do campo
            $field->update([
                'name' => $validated['name'],
                'price_hour' => $validated['price_hour'],
                'company_id' => $validated['company_id'],
                'type_floor' => $validated['type_floor'],
                'illumination' => $validated['illumination'],
                'cover' => $validated['cover'],
                'shower_room' => $validated['shower_room'],
                'lockers' => $validated['lockers'],
                'rent_equipment' => $validated['rent_equipment'],
                'status' => $validated['status'],
                'last_maintenance' => $validated['last_maintenance'],
                'file_path' => $filePath,
            ]);

            // Atualizar os horários fornecidos
            $schedules = $validated['schedules'];

            // Remover entradas anteriores para evitar duplicação
            DB::table('field_schedule')->where('field_id', $fieldId)->delete();

            // Define horários para os dias úteis (segunda a sexta-feira)
            $weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            foreach ($weekdays as $day) {
                DB::table('field_schedule')->insert([
                    'field_id' => $fieldId,
                    'day_of_week' => $day,
                    'opening_time' => $schedules['weekdays']['is_closed'] ? null : $schedules['weekdays']['opening_time'],
                    'closing_time' => $schedules['weekdays']['is_closed'] ? null : $schedules['weekdays']['closing_time'],
                    'is_closed' => $schedules['weekdays']['is_closed'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Define horário para sábado
            DB::table('field_schedule')->insert([
                'field_id' => $fieldId,
                'day_of_week' => 'saturday',
                'opening_time' => $schedules['saturday']['is_closed'] ? null : $schedules['saturday']['opening_time'],
                'closing_time' => $schedules['saturday']['is_closed'] ? null : $schedules['saturday']['closing_time'],
                'is_closed' => $schedules['saturday']['is_closed'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Define horário para domingo
            DB::table('field_schedule')->insert([
                'field_id' => $fieldId,
                'day_of_week' => 'sunday',
                'opening_time' => $schedules['sunday']['is_closed'] ? null : $schedules['sunday']['opening_time'],
                'closing_time' => $schedules['sunday']['is_closed'] ? null : $schedules['sunday']['closing_time'],
                'is_closed' => $schedules['sunday']['is_closed'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Campo e horários atualizados com sucesso!',
                'field' => $field->load('schedules')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao atualizar o campo!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($fieldId)
    {
        // Encontrar o campo
        $field = Field::find($fieldId);

        // Se o campo não existir, retorna mensagem de erro
        if (!$field) {
            return response()->json([
                'message' => 'Campo não foi encontrado!'
            ], 404);
        }

        // Verifica se o campo tem um arquivo de imagem e tenta excluí-lo
        if ($field->file_path) {
            // Gerar o caminho absoluto do arquivo para exclusão
            $filePath = storage_path('app/public/' . $field->file_path);

            try {
                // Verifica se o arquivo existe antes de tentar excluí-lo
                if (file_exists($filePath)) {
                    unlink($filePath); // Exclui o arquivo
                }
            } catch (\Exception $e) {
                // Loga o erro e continua com a exclusão do campo
                \Log::error('Erro ao excluir imagem: ' . $e->getMessage());
            }
        }

        // Exclui o campo do banco de dados
        $field->delete();

        // Retorna uma resposta de sucesso com o nome do campo
        return response()->json([
            'message' => 'Campo ' . $field->name . ' eliminado com sucesso!'
        ]);
    }

    /**
     * Search for any name
     */
    public function search($name = null)
    {
        try {
            //If something was sent in the route
            if ($name) {
                //Get all fields that matches with the data sent
                $fields = Field::with('company')
                    ->where('name', 'LIKE', '%' . $name . '%')
                    ->get();
            }

            //Return the data
            return response()->json([
                'message' => 'Resultados da sua pesquisa:',
                'fields' => $fields
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
            'message' => 'Erro ao procurar o campo!',
            'error' => $e->getMessage()
            ], 500);
        }
    }

}
