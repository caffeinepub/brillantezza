import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ChatMessage,
  type ClassType,
  type Content,
  ExternalBlob,
  type Question,
  type Subject,
} from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClassContent(
  classType: ClassType | null,
  subject: Subject | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Content>({
    queryKey: ["classContent", classType, subject],
    queryFn: async () => {
      if (!actor || !classType || !subject)
        return { live: "", notes: "", recorded: [], questions: [] };
      return actor.getClassContent(classType, subject);
    },
    enabled: !!actor && !isFetching && !!classType && !!subject,
  });
}

export function useChatMessages(
  classType: ClassType | null,
  subject: Subject | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages", classType, subject],
    queryFn: async () => {
      if (!actor || !classType || !subject) return [];
      return actor.getChatMessages(classType, subject);
    },
    enabled: !!actor && !isFetching && !!classType && !!subject,
    refetchInterval: 5000,
  });
}

export function useGooglePayQr() {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["googlePayQr"],
    queryFn: async () => {
      if (!actor) return null;
      const blob = await actor.getGooglePayQrBlob();
      if (!blob) return null;
      return blob.getDirectURL();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChatMessage(classType: ClassType, subject: Subject) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      senderName,
      text,
    }: { senderName: string; text: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addChatMessage(
        classType,
        subject,
        senderName,
        "student",
        text,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", classType, subject],
      });
    },
  });
}

export function useSubmitTest(classType: ClassType, subject: Subject) {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      studentName,
      score,
    }: { studentName: string; score: number }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitTest(studentName, classType, subject, BigInt(score));
    },
  });
}

export function useUpdateClassContent(classType: ClassType, subject: Subject) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      live,
      recorded,
      notes,
      questions,
    }: {
      live: string;
      recorded: string[];
      notes: string;
      questions: Question[];
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateClassContent(
        classType,
        subject,
        live,
        recorded,
        notes,
        questions,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classContent", classType, subject],
      });
    },
  });
}

export function useUpdateGooglePayQr() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      await actor.updateGooglePayQrBlob(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["googlePayQr"] });
    },
  });
}
