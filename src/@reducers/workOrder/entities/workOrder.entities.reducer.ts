import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";

import {
    WorkOrdersListTempleteActions, WorkOrderViewPageActions, WorkOrderEditTempleteActions
} from "@actions/workOrder";
import { Inventory } from "@entities/inventory";

export const featureKey = "workOrder.entities";

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Inventory> {}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Inventory> = createEntityAdapter<Inventory>({
    selectId: (workOrder: Inventory) => workOrder.id,
    sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({});

export const reducer = createReducer(
    initialState,
    on(
        WorkOrdersListTempleteActions.selectListSuccess,
        (state, { workOrders }) => adapter.upsertMany(workOrders, state)
    ),
    on(
        WorkOrderViewPageActions.findSuccess,
        WorkOrderEditTempleteActions.createSuccess,
        WorkOrderEditTempleteActions.updateSuccess,
        WorkOrdersListTempleteActions.create,
        WorkOrdersListTempleteActions.update,
        (state, { workOrder }) => adapter.upsertOne(workOrder, state)
    ),
    on(
        WorkOrdersListTempleteActions.remove,
        (state, { workOrder }) => adapter.removeOne(workOrder.id, state)
    )
);