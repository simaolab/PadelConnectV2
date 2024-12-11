<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Models\Field;
use App\Models\Company;
use Illuminate\Support\Facades\DB;


class FieldController extends Controller
{
    /**
     * Public index: accessible by all roles, returns all fields without restrictions.
     */
    public function publicIndex()
    {
        //Try to get all Fields from table Field
        try
        {
            $fields = Field::with('company', 'schedules')
              ->whereNotIn('status', ['inativo', 'indisponivel'])
              ->get();

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
     * Role-based index: accessible with restrictions based on user role.
     */
    public function roleBasedIndex()
    {
        try {
            // Get the authenticated user
            $user = auth()->user();

            if ($user->role_id === 1) {
                // Admin: Returns all fields
                $fields = Field::with('company', 'schedules')->get();
            } elseif ($user->role_id === 2) {
                // Company: Returns the fields of the company associated with the user
                $company = Company::where('user_id', $user->id)->first();

                // Check if the user is associated with a company
                if (!$company) {
                    return response()->json(['message' => 'Usuário não está associado a nenhuma empresa.'], 404);
                }

                // Get the fields associated with the company
                $fields = Field::where('company_id', $company->id)->with('company', 'schedules')->get();
            } else {
                // Other roles: Returns an empty collection or an access error
                $fields = collect(); // Or return an error: return response()->json([‘message’ => ‘Unauthorised access’], 403);
            }

            // Check if there are fields available for the user's role
            if ($fields->isEmpty()) {
                return response()->json([
                    'message' => 'Não há campos disponíveis para o seu papel.',
                    'fields' => []
                ], 200);
            }

            // Return the fields found
            return response()->json([
                'fields' => $fields
            ], 200);

        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
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
          // Validation of received data
          $validated = $request->validated();

          $filePath = null;
          if ($request->hasFile('file_path')) {
              $filePath = $this->uploadFile($request->file('file_path')); // Calls the upload function
          }

          // Field creation using Eloquent (with the create() method)
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

          // Now that the Field has been created, we get the field ID
          $fieldId = $field->id;
            if (!isset($validated['schedules'])) {
          		return response()->json(['error' => 'Horários não foram fornecidos.'], 400);
      		}

          // Define working hours (Monday to Friday)
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

          // Set the schedule for Saturday
          DB::table('field_schedule')->updateOrInsert(
              ['field_id' => $fieldId, 'day_of_week' => 'saturday'],
              [
                  'opening_time' => $validated['schedules']['saturday']['opening_time'],
                  'closing_time' => $validated['schedules']['saturday']['closing_time'],
                  'is_closed' => $validated['schedules']['saturday']['is_closed'],
                  'updated_at' => now(),
              ]
          );

          // Set the schedule for Sunday
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




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['error' => 'Campo não encontrado'], 404);
        }

        // Getting the schedules
        $schedules = $field->schedules;

        // Filtering schedules
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

        // Organising the response
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
            // Search the field by ID
            $field = Field::find($fieldId);

            if (!$field) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Campo não encontrado!',
                ], 404);
            }

            // Validate the data sent
            $validated = $request->validated();

            // Handle file upload
			$filePath = $field->file_path;
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                // Delete the old image, if necessary
                if ($field->file_path && Storage::disk('public')->exists($field->file_path)) {
                    Storage::disk('public')->delete($field->file_path);
                }

                // Store the new image
                $filePath = $request->file('image')->store('images', 'public'); // Stores the image in the ‘images’ directory of ‘public’
            }

            // Update the field data
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
                'file_path' => $filePath, // Update the file path, if any
            ]);

            // Update the schedules provided
            $schedules = $validated['schedules'];

            // Remove previous timetable entries to avoid duplication
            DB::table('field_schedule')->where('field_id', $fieldId)->delete();

            // Define working hours (Monday to Friday)
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

            // Set the schedule for Saturday
            DB::table('field_schedule')->insert([
                'field_id' => $fieldId,
                'day_of_week' => 'saturday',
                'opening_time' => $schedules['saturday']['is_closed'] ? null : $schedules['saturday']['opening_time'],
                'closing_time' => $schedules['saturday']['is_closed'] ? null : $schedules['saturday']['closing_time'],
                'is_closed' => $schedules['saturday']['is_closed'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Set the schedule for Sunday
            DB::table('field_schedule')->insert([
                'field_id' => $fieldId,
                'day_of_week' => 'sunday',
                'opening_time' => $schedules['sunday']['is_closed'] ? null : $schedules['sunday']['opening_time'],
                'closing_time' => $schedules['sunday']['is_closed'] ? null : $schedules['sunday']['closing_time'],
                'is_closed' => $schedules['sunday']['is_closed'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Return success response with updated data
            return response()->json([
                'status' => 'success',
                'message' => 'Campo e horários atualizados com sucesso!',
                'field' => $field->load('schedules') // Returns the field with the updated times
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao atualizar o campo!',
            ], 500);
        }
    }





    /**
     * Remove the specified resource from storage.
     */
    public function destroy($fieldId)
    {
        $field = Field::find($fieldId);

        if (!$field) {
            return response()->json([
                'message' => 'Campo não foi encontrado!'
            ], 404);
        }

        // Checks if the field has an image file and tries to delete it
        if ($field->file_path) {
            // Generate the absolute path of the file to delete
            $filePath = storage_path('app/public/' . $field->file_path);

            try {
                // Checks if the file exists before trying to delete it
                if (file_exists($filePath)) {
                    unlink($filePath); // Delete the file
                }
            } catch (\Exception $e) {
                // Optionally, return a message in the response
                return response()->json([
                    'message' => 'Ocorreu um erro ao tentar excluir o arquivo.',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        // Delete the field from the database
        $field->delete();

        // Returns a success response with the field name
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

        private function uploadFile($file)
      {
        $filePath = $file->store('fields', 'public');

        return $filePath;
      }

      private function deleteOldFile($filePath)
      {
          // Check if the file exists and delete
          $fullPath = storage_path('app/public/' . $filePath);
          if (file_exists($fullPath)) {
              unlink($fullPath);
          }
      }

}
