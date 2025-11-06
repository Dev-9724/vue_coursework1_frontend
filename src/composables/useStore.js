import { reactive, computed } from 'vue'

const state = reactive({
    lessons: [
        { _id: '1', subject: 'Art & Crafts', location: 'Golders Green', price: 10.0, spaces: 5, rating: 4, image: '' },
        { _id: '2', subject: 'Maths — Young Learners', location: 'Hendon', price: 12.5, spaces: 5, rating: 4, image: '' },
        { _id: '3', subject: 'Coding Club', location: 'Colindale', price: 18.0, spaces: 5, rating: 5, image: '' },
        { _id: '4', subject: 'Science Lab Explorers', location: 'Finchley', price: 15.0, spaces: 5, rating: 5, image: '' },
        { _id: '5', subject: 'Robotics Workshop', location: 'Camden', price: 22.0, spaces: 5, rating: 5, image: '' },
        { _id: '6', subject: 'Creative Writing', location: 'Barnet', price: 11.0, spaces: 5, rating: 4, image: '' },
        { _id: '7', subject: 'Music Band Basics', location: 'Harrow', price: 14.0, spaces: 5, rating: 4, image: '' },
        { _id: '8', subject: 'Drama & Theatre', location: 'Kilburn', price: 13.5, spaces: 5, rating: 4, image: '' },
        { _id: '9', subject: 'Chess Strategy', location: 'Wembley', price: 9.0, spaces: 5, rating: 5, image: '' },
        { _id: '10', subject: 'Football Skills', location: 'Ealing', price: 12.0, spaces: 5, rating: 3, image: '' },
    ],
    cart: [],
    sortKey: 'price',
    sortDir: 'asc',
    search: '' 
})


const sortedLessons = computed(() => {
    const arr = [...state.lessons]
    arr.sort((a, b) => {
        const A = a[state.sortKey]
        const B = b[state.sortKey]
        if (typeof A === 'number' && typeof B === 'number') {
            return state.sortDir === 'asc' ? A - B : B - A
        }
        const As = String(A ?? '').toLowerCase()
        const Bs = String(B ?? '').toLowerCase()
        return state.sortDir === 'asc' ? As.localeCompare(Bs) : Bs.localeCompare(As)
    })
    return arr
})

const cartTotal = computed(() => state.cart.reduce((s, i) => s + Number(i.price || 0), 0))

export function useStore() {
    function setSort({ sortKey, sortDir }) {
        state.sortKey = sortKey
        state.sortDir = sortDir
    }

    function addToCart(lesson) {
        if (lesson.spaces > 0) {
            lesson.spaces -= 1
            state.cart.push({ ...lesson })
        }
    }

    function removeFromCart(id) {
        const idx = state.cart.findIndex(i => i._id === id)
        if (idx !== -1) {
            const lesson = state.lessons.find(l => l._id === id)
            if (lesson) lesson.spaces += 1
            state.cart.splice(idx, 1)
        }
    }

    function qtyInCart(id) {
        return state.cart.filter(i => i._id === id).length
    }

    return {
        state,
        sortedLessons,
        cartTotal,
        setSort,
        addToCart,
        removeFromCart,
        qtyInCart
    }
}
