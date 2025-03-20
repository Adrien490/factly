import { useCallback, useEffect, useState } from "react";
import countTags from "../queries/count-tags";
import { CountTagsParams } from "../schemas/count-tags-schema";

export default function useCountTags(initialParams: CountTagsParams) {
	const [params, setParams] = useState<CountTagsParams>(initialParams);
	const [count, setCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchCount = useCallback(async (fetchParams: CountTagsParams) => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await countTags(fetchParams);
			setCount(result);
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Erreur lors du comptage des tags")
			);
			console.error("Erreur lors du comptage des tags:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCount(params);
	}, [params, fetchCount]);

	const updateParams = useCallback((newParams: Partial<CountTagsParams>) => {
		setParams((prevParams) => ({
			...prevParams,
			...newParams,
		}));
	}, []);

	return {
		count,
		isLoading,
		error,
		params,
		updateParams,
		refetch: () => fetchCount(params),
	};
}
