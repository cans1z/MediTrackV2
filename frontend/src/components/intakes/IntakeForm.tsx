"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IntakeRequestDto } from "@/entities/intakes/intake.dto";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: IntakeRequestDto;
  onSubmit: (dto: IntakeRequestDto) => Promise<void>;
  onCancel: () => void;
}

// Форматирование даты-времени для локального инпута datetime-local (YYYY-MM-DDTHH:mm)
const formatToDatetimeLocal = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const tzoffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
  return localISOTime;
};

const defaultValues: IntakeRequestDto = {
  scheduledAt: new Date().toISOString().slice(0, 16),
  takenAt: null,
  comment: "",
  prescriptionId: 0,
};

export default function IntakeForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [isTaken, setIsTaken] = useState(false);

  const form = useForm<IntakeRequestDto>({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (initial) {
        form.reset({
          scheduledAt: formatToDatetimeLocal(initial.scheduledAt),
          takenAt: initial.takenAt ? formatToDatetimeLocal(initial.takenAt) : null,
          comment: initial.comment || "",
          prescriptionId: initial.prescriptionId,
        });
        setIsTaken(!!initial.takenAt);
      } else {
        form.reset(defaultValues);
        setIsTaken(false);
      }
    }
  }, [open, initial, form]);

  const handleFormSubmit = async (data: IntakeRequestDto) => {
    setLoading(true);
    try {
      const payload: IntakeRequestDto = {
        ...data,
        prescriptionId: Number(data.prescriptionId),
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        takenAt: isTaken && data.takenAt ? new Date(data.takenAt).toISOString() : null,
      };

      await onSubmit(payload);
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
                {initial ? "Редактирование приема" : "Добавление приема"}
              </DialogTitle>
              <DialogDescription>
                {initial
                  ? "Измените параметры или зафиксируйте фактическое время приема"
                  : "Заполните данные для планирования нового приема препарата"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              {/* Поле Prescription ID показываем только при создании */}
              {!initial && (
                <FormField
                  control={form.control}
                  name="prescriptionId"
                  rules={{ required: "Обязательное поле", min: { value: 1, message: "Некорректный ID" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Рецепта/Назначения <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Например, 12"
                          className="w-full focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Поле: Запланированное время */}
              <FormField
                control={form.control}
                name="scheduledAt"
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Запланировано на <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Чекбокс: Препарат уже принят */}
              <div className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4 shadow-sm">
                <input
                  type="checkbox"
                  id="isTakenCheckbox"
                  checked={isTaken}
                  onChange={(e) => {
                    setIsTaken(e.target.checked);
                    if (e.target.checked && !form.getValues("takenAt")) {
                      form.setValue("takenAt", formatToDatetimeLocal(new Date().toISOString()));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="isTakenCheckbox" className="text-sm font-medium cursor-pointer">
                    Отметить как принятый
                  </label>
                  <p className="text-xs text-gray-500">
                    Установите флаг, если лекарство уже выпито.
                  </p>
                </div>
              </div>

              {/* Поле: Фактическое время приема (показывается, если активен чекбокс) */}
              {isTaken && (
                <FormField
                  control={form.control}
                  name="takenAt"
                  rules={{ required: "Укажите время приема" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фактическое время приема <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="w-full focus-visible:ring-blue-500"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Поле: Комментарий */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Комментарий</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Запить большим количеством воды"
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