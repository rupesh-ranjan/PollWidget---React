import type { CSSProperties } from "react";

export interface Option {
    id: number;
    title: string;
    votes: number;
}

export interface Poll {
    id: number;
    question: string;
    totalCount: number;
    options: Option[];
}

export interface PollStyles {
    container?: CSSProperties;
    title?: CSSProperties;
    optionsContainer?: CSSProperties;
    optionLabel?: CSSProperties;
    optionInput?: CSSProperties;
    optionVotes?: CSSProperties;
    progressBar?: CSSProperties;
    progressBarFill?: CSSProperties;
    removeButton?: CSSProperties;
}

export interface PollProps {
    pollId: number;
    title: string;
    options: Option[];
    isMultiple?: boolean;
    onVote: (pollId: number, selectedOptions: number[]) => Promise<Option[]>;
    onVoteRemove: (
        pollId: number,
        selectedOptions: number[],
    ) => Promise<Option[]>;
    styles?: PollStyles;
}
