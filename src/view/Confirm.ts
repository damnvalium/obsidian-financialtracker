import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewConfirm(placeholder:{
    message: string,
},cb: {
    confirm: () => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`⚠️ ${placeholder.message}`,
            [],
            () => resolve(cb.confirm()),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}