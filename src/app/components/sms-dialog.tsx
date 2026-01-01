"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

/* =====================
   Config
===================== */
const MAX_SMS_CHARS = 160;

/* =====================
   Utils
===================== */

// Emoji-safe character counter
const countCharacters = (text: string) =>
  [...new Intl.Segmenter().segment(text)].length;

// Sanitize SMS input
const sanitizeSMS = (value: string) =>
  value
    .normalize("NFC") // normalize unicode
    .replace(/[\u0000-\u001F\u007F]/g, "") // remove control chars
    .replace(/\s+/g, " ") // collapse whitespace
    .trim()
    .slice(0, 500); // hard safety cap

export function SendSMSDialog({
  selectedContacts,
  handleSendBulkSMS,
  isSending,
  isSmsDialogOpen,
  setIsSmsDialogOpen,
  message,
  setMessage,
}: {
  selectedContacts: Set<string>;
  handleSendBulkSMS: (message: string) => void;
  isSmsDialogOpen: boolean;
  setIsSmsDialogOpen: (state: boolean) => void;
  setMessage: (message: string) => void;
  message: string;
  isSending: boolean;
}) {
  const [] = useState("");

  const sanitizedMessage = useMemo(() => sanitizeSMS(message), [message]);

  const charCount = useMemo(
    () => countCharacters(sanitizedMessage),
    [sanitizedMessage]
  );

  const isOverLimit = charCount > MAX_SMS_CHARS;
  const isDisabled =
    selectedContacts.size === 0 || charCount === 0 || isOverLimit;

  return (
    <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen}>
      <DialogContent className="lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogDescription>Enter your message below</DialogDescription>
        </DialogHeader>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            placeholder="Type your SMS message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className="w-full border rounded-md focus:ring-4 focus:rounded-md focus:ring-gray-300 transition p-2.5"
          />

          {/* Character Counter */}
          <div
            className={`text-sm text-right ${
              isOverLimit ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {charCount} / {MAX_SMS_CHARS} characters.
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={isSending || isDisabled}
            onClick={() => handleSendBulkSMS(sanitizedMessage)}
          >
            {isSending ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <div className="flex items-center space-x-2">
                <SendIcon className="size-4 mr-2" />
                Send to {selectedContacts.size}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
