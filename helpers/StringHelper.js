export class StringHelper {
    static stringHasValue(value) {
        return value != null && value.trim().length > 0;
    }
}