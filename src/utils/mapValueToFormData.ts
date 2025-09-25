type AllowedFormValues =
    | string
    | number
    | File
    | null
    | undefined
    | boolean
    | FileList
    | readonly string[]
    | Record<string, unknown>;

export const mapValueToFormData = (
    formData: FormData,
    name: string,
    value: AllowedFormValues | AllowedFormValues[]
) => {
    if (value instanceof File) {
        formData.append(name, value, value.name);
    } else if (Array.isArray(value)) {
        value.forEach((item) => {
            mapValueToFormData(formData, name, item);
        });
    } else if (value instanceof FileList) {
        for (const file of value) {
            formData.append(name, file, file.name);
        }
    } else if (value != null) {
        if (typeof value === 'object') {
            formData.append(name, JSON.stringify(value));
        } else {
            formData.append(name, value.toString());
        }
    }
};
