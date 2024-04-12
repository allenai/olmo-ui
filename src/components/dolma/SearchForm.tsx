import { SearchBar } from './SearchBar';

export const SearchForm = ({
    defaultValue,
    disabled,
}: {
    defaultValue?: string;
    disabled?: boolean;
    noCard?: boolean;
}) => {
    return <SearchBar defaultValue={defaultValue} disabled={disabled} />;
};
