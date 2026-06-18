// src/components/medications/MedicationForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import type { MedicationRequestDto } from "@/entities/medications/medication.dto";
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
  initial?: MedicationRequestDto;
  onSubmit: (dto: MedicationRequestDto) => Promise<void>;
  onCancel: () => void;
}

export default function MedicationForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<MedicationRequestDto>({
    defaultValues: initial ?? { name: "", description: "", dosageForm: "" },
  });

  // Обновляем форму, если initial меняется при открытии модалки
  useEffect(() => {
    if (open) {
      form.reset(initial ?? { name: "", description: "", dosageForm: "" });
    }
  }, [open, initial, form]);

  const handleFormSubmit = async (data: MedicationRequestDto) => {
    setLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false); // Закрываем диалог после успешного сохранения
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
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader className="text-left flex flex-col gap-1.5">
              <DialogTitle>
                {initial ? "Редактирование препарата" : "Добавление препарата"}
              </DialogTitle>
              <DialogDescription>
                {initial
                  ? "Измените данные препарата"
                  : "Заполните поля для добавления нового препарата"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Поле: Название */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Название препарата{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например, Парацетамол"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Поле: Описание */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание / Примечание</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="После еды, запивать водой"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Поле: Форма выпуска */}
              <FormField
                control={form.control}
                name="dosageForm"
                rules={{ required: "Обязательное поле" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Форма выпуска <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Таблетки, капсулы, сироп"
                        className="w-full focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[100px]">
                {loading
                  ? "Сохранение..."
                  : initial
                  ? "Сохранить"
                  : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};