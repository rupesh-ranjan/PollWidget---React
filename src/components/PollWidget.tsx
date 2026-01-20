import { useEffect, useState, type FC } from "react";
import type { Option, PollProps } from "../types";

function PollWidget({
    pollId,
    title,
    options,
    isMultiple = false,
    onVote,
    onVoteRemove,
    styles = {},
}: PollProps) {
    const [currentOptions, setCurrentOptions] = useState<Option[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    console.log("Is Multiple", isMultiple);
    useEffect(() => {
        const storedVotes = localStorage.getItem(`poll-${pollId}`);
        if (storedVotes) {
            setSelectedOptions(JSON.parse(storedVotes));
        }
    }, [pollId]);

    const totalVotes = currentOptions.reduce(
        (acc, options) => acc + options.votes,
        0,
    );

    const handleVote = async (optionId: number) => {
        let newSelectedOptions: number[];
        if (isMultiple) {
            // multiple selection
            let updatedOptions;
            if (selectedOptions.includes(optionId)) {
                // remove
                newSelectedOptions = selectedOptions.filter(
                    (id) => id !== optionId,
                );
                updatedOptions = await onVoteRemove(pollId, [optionId]);
            } else {
                newSelectedOptions = [...selectedOptions, optionId];
                updatedOptions = await onVote(pollId, [optionId]);
            }
            setCurrentOptions(updatedOptions);
        } else {
            // change option (if any one is already selected)
            if (selectedOptions.length > 0 && selectedOptions[0] !== optionId) {
                const updatedOptions = await onVoteRemove(
                    pollId,
                    selectedOptions,
                );
                setCurrentOptions(updatedOptions);
            }
            // select option
            newSelectedOptions = [optionId];
            const updatedOptions = await onVote(pollId, newSelectedOptions);
            setCurrentOptions(updatedOptions);
        }
        setSelectedOptions(newSelectedOptions);
        localStorage.setItem(
            `poll-${pollId}`,
            JSON.stringify(newSelectedOptions),
        );
    };

    const handleRemoveVote = async () => {
        const updatedOptions = await onVoteRemove(pollId, selectedOptions);
        setSelectedOptions([]);
        localStorage.removeItem(`poll-${pollId}`);
        setCurrentOptions(updatedOptions);
    };

    return (
        <fieldset
            className="p-4 border bvorder-gray-300 rounded-lg max-w-md mx-auto"
            role="group"
            aria-labelledby={`poll-${pollId}-title`}
            style={styles.container}
        >
            <legend
                id={`poll-${pollId}-title`}
                className="text-lg font-semibold"
                style={styles.title}
            >
                {title}
            </legend>
            <div
                className="space-y-2 overflow-y-auto"
                style={{
                    ...styles.optionsContainer,
                    maxHeight: currentOptions.length > 4 ? "200" : "auto",
                }}
            >
                {currentOptions.map((option) => {
                    const votePercentage =
                        totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

                    return (
                        <div key={option.id} className="space-y-1">
                            <div className="flex items-center justify-between gap-8">
                                <label
                                    className="flex items-center space-x-2"
                                    style={styles.optionLabel}
                                    htmlFor={`option-${option.id}`}
                                >
                                    <input
                                        id={`option-${option.id}`}
                                        onChange={() => handleVote(option.id)}
                                        checked={selectedOptions.includes(
                                            option.id,
                                        )}
                                        aria-checked={selectedOptions.includes(
                                            option.id,
                                        )}
                                        aria-describedby={`option-${option.id}-info`}
                                        type={isMultiple ? "checkbox" : "radio"}
                                        style={styles.optionInput}
                                    />
                                    <span id={`option-${option.id}-info`}>
                                        {option.title}
                                    </span>
                                </label>
                                {selectedOptions.length > 0 && (
                                    <span style={styles.optionVotes}>
                                        {option.votes} votes (
                                        {votePercentage.toFixed(1)}%)
                                    </span>
                                )}
                            </div>
                            <div
                                className="w-full bg-gray-200 rounded-full h-2"
                                style={styles.progressBar}
                            >
                                {selectedOptions.length > 0 && (
                                    <div
                                        className="bg-blue-500 h-full rounded-full transform origin-left"
                                        style={{
                                            ...styles.progressBar,
                                            transform: `scaleX(${votePercentage / 100})`,
                                        }}
                                    ></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                className="bg-red-500 mt-4 p-2 rounded-lg text-white hover:cursor-pointer"
                onClick={handleRemoveVote}
            >
                Remove Vote
            </button>
        </fieldset>
    );
}

export default PollWidget;
