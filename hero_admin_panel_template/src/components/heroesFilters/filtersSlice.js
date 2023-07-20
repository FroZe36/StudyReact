import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: 'idle',
//   activeFilter: 'all',
// };
const filterAdapter = createEntityAdapter({
  selectId: (filter) => filter.name
})

const initialState = filterAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all'
})

console.log(initialState)

export const fetchFilters = createAsyncThunk('heroes/fetchFilters', () => {
  const { request } = useHttp();
  return request('http://localhost:3001/filters');
});

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    activeFilterChanged: (state, action) => {
      state.activeFilter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
        .addCase(fetchFilters.fulfilled, (state, action) => {
          state.filtersLoadingStatus = 'idle';
          filterAdapter.setAll(state, action.payload)
        })
        .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
        .addDefaultCase(() => {});
  }
})

const {actions, reducer} = filtersSlice;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters);

export default reducer
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  activeFilterChanged
} = actions