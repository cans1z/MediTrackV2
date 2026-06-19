"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import type { PrescriptionRequestDto, UpdatePrescriptionDto } from "@/entities/prescriptions/prescription.dto";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

// Описываем Props без дженериков, используя явное разделение (Discriminated Union)
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
} & (
  | {
      initial?: undefined; // Форма создания
      onSubmit: (dto: PrescriptionRequestDto) => Promise<void>;
    }
  | {
      initial: UpdatePrescriptionDto; // Форма редактирования
      onSubmit: (dto: UpdatePrescriptionDto) => Promise<void>;
    }
);

const defaultValues: PrescriptionRequestDto = {
  dosage: "",
  frequency: "OnceADay",
  startDate: new Date().toISOString().substring(0, 10),
  period: 1,
  isFlexible: false,
  comment: "",
  patientId: 0,
  medicationId: 0,
};

export default function PrescriptionForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  // Внутреннее состояние формы ВСЕГДА PrescriptionRequestDto
  const form = useForm<PrescriptionRequestDto>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (initial) {
        // Заполняем форму данными для апдейта, подставляя заглушки для ID, чтобы RHF не ругался
        form.reset({
          dosage: initial.dosage,
          frequency: initial.frequency,
          startDate: initial.startDate ? initial.startDate.substring(0, 10) : defaultValues.startDate,
          period: initial.period,
          isFlexible: initial.isFlexible,
          comment: initial.comment || "",
          patientId: 0,     // Игнорируются на бэкенде
          medicationId: 0,  // Игнорируются на бэкенде
        });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [open, initial, form]);

  const handleFormSubmit = async (data: PrescriptionRequestDto) => {
    setLoading(true);
    try {
      if (initial) {
        // Если это режим редактирования, отдаем наверх только поля UpdatePrescriptionDto
        const updatePayload: UpdatePrescriptionDto = {
          dosage: data.dosage,
          frequency: data.frequency,
          startDate: new Date(data.startDate).toISOString(),
          period: Number(data.period),
          isFlexible: data.isFlexible,
          comment: data.comment,
        };
        await (onSubmit as (dto: UpdatePrescriptionDto) => Promise<void>)(updatePayload);
      } else {
        // Если это создание, отдаем полный PrescriptionRequestDto
        const createPayload: PrescriptionRequestDto = {
          ...data,
          period: Number(data.period),
          patientId: Number(data.patientId),
          medicationId: Number(data.medicationId),
          startDate: new Date(data.startDate).toISOString(),
        };
        await (onSubmit as (dto: PrescriptionRequestDto) => Promise<void>)(createPayload);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
            <DialogHeader className="text-left flex flex-col gap-1.5">
              <DialogTitle>
                {initial ? "Редактирование назначения" : "Добавление назначения"}
              </DialogTitle>
              <DialogDescription>
                {initial
                  ? "Измените параметры рецепта или назначения"
                  : "Заполните поля для создания нового назначения пациенту"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              {/* Поля ID показываем ТОЛЬКО при создании (когда нет initial) */}
              {!initial && (
                <>
                  {/* Поле: PatientId */}
                  <FormField
                    control={form.control}
                    name="patientId"
                    rules={{ required: "Обязательное поле", min: { value: 1, message: "Некорректный ID" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Пациента <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Например, 42"
                            className="w-full focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Поле: MedicationId */}
                  <FormField
                    control={form.control}
                    name="medicationId"
                    rules={{ required: "Обязательное поле", min: { value: 1, message: "Некорректный ID" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Препарата <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Например, 7"
                            className="w-full focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Поле: Дозировка */}
              <FormField
                control={form.control}
                name="dosage"
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дозировка <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например, 500 мг, 1 таблетка"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Поле: Частота */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Частота приема</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <option value="OnceADay">Один раз в день</option>
                        <option value="TwiceADay">Дважды в день</option>
                        <option value="ThriceADay">Трижды в день</option>
                        <option value="EveryOtherDay">Через день</option>
                        <option value="Weekly">Раз в неделю</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Поле: Дата начала */}
                <FormField
                  control={form.control}
                  name="startDate"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата начала <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="w-full focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Поле: Период */}
                <FormField
                  control={form.control}
                  name="period"
                  rules={{ required: "Обязательное поле", min: { value: 1, message: "Минимум 1 день" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Длительность (дней) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-full focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Поле: IsFlexible */}
              <FormField
                control={form.control}
                name="isFlexible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Гибкий график приема</FormLabel>
                      <p className="text-xs text-gray-500">
                        Разрешить смещение времени приема при необходимости.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Поле: Комментарий */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий / Примечание</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Принимать строго после еды"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[100px]">
                {loading ? "Сохранение..." : initial ? "Сохранить" : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}