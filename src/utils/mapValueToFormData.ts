type AllowedFormValues = string | number | File | null | undefined | boolean;

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
    } else if (value != null) {
        formData.append(name, value.toString());
    }
};
