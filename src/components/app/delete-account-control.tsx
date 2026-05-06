"use client";

import { useActionState, useState } from "react";
import { Trash2Icon } from "lucide-react";

import { deleteAccount, type DeleteAccountState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: DeleteAccountState = {
  message: "",
};

export function DeleteAccountControl() {
  const [confirmation, setConfirmation] = useState("");
  const [state, formAction, isPending] = useActionState(
    deleteAccount,
    initialState,
  );
  const canDelete = confirmation === "DELETE";

  return (
    <form
      action={formAction}
      className="rounded-md border border-destructive/40 bg-destructive/5 p-3"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="deleteConfirm">Delete account</FieldLabel>
          <FieldDescription>
            This removes your login and saved study data. Type DELETE to unlock
            it.
          </FieldDescription>
          <Input
            id="deleteConfirm"
            name="confirm"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="DELETE"
            autoComplete="off"
          />
          <FieldError>{state.message}</FieldError>
        </Field>
        <Button
          type="submit"
          variant="destructive"
          disabled={!canDelete || isPending}
          className="w-full sm:w-fit"
        >
          <Trash2Icon data-icon="inline-start" aria-hidden="true" />
          {isPending ? "Deleting account" : "Delete account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
