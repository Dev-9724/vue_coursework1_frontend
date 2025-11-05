import { reactive, computed } from 'vue'

const state = reactive({
    lessons: [
        { _id: '1', subject: 'Art & Crafts', location: 'Golders Green', price: 10.0, spaces: 9, rating: 3, image: 'https://picsum.photos/id/1015/800/500' },
        { _id: '2', subject: 'Maths — Young Learners', location: 'Hendon', price: 12.5, spaces: 7, rating: 4, image: 'https://picsum.photos/id/102/800/500' },
        { _id: '3', subject: 'Coding Club', location: 'Colindale', price: 18.0, spaces: 4, rating: 5, image: 'https://picsum.photos/id/1005/800/500' },
    ],
    cart: [],
    sortKey: 'subject',
    sortDir: 'asc'
})

const sortedLessons = computed(() => {
    const arr = [...state.lessons]
    arr.sort((a, b) => {
        const A = a[state.sortKey]
        const B = b[state.sortKey]
        if (typeof A === 'number' && typeof B === 'number') {
            return state.sortDir === 'asc' ? A - B : B - A
        }
        return state.sortDir === 'asc'
            ? String(A).localeCompare(String(B))
            : String(B).localeCompare(String(A))
    })
    return arr
})

const cartTotal = computed(() => state.cart.reduce((s, i) => s + i.price, 0))

export function useStore() {
    function setSort({ sortKey, sortDir }) {
        state.sortKey = sortKey
        state.sortDir = sortDir
    }
    function addToCart(lesson) {
        state.cart.push(lesson)
    }
    function removeFromCart(id) {
        const idx = state.cart.findIndex(i => i._id === id)
        if (idx !== -1) state.cart.splice(idx, 1)
    }

    return {
        state,
        sortedLessons,
        cartTotal,
        setSort,
        addToCart,
        removeFromCart
    }
}
