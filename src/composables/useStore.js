import { reactive, computed } from 'vue'

const API_BASE = 'https://vue-coursework1-backend.onrender.com'

const state = reactive({
    lessons: [],
    cart: [],
    sortKey: 'price',
    sortDir: 'asc',
    search: '',
    loadingLessons: false,
    lessonsError: null,
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

// Filtered lessons (top-level) — depends on store.search + sortedLessons
const filteredLessons = computed(() => {
    const term = String(state.search || '').trim().toLowerCase()
    if (!term) return sortedLessons.value

    return sortedLessons.value.filter(lesson => {
        const subject = String(lesson.subject || '').toLowerCase()
        const location = String(lesson.location || '').toLowerCase()
        return subject.includes(term) || location.includes(term)
    })
})

// ---- NEW: grouped cart (for checkout) ----
const groupedCart = computed(() => {
    const map = new Map()

    for (const item of state.cart) {
        if (!map.has(item._id)) {
            map.set(item._id, {
                _id: item._id,
                subject: item.subject,
                location: item.location,
                price: item.price,
                spaces: item.spaces, // current spaces left (from lesson)
                qty: 0,
                total: 0,
            })
        }
        const group = map.get(item._id)
        group.qty++
        group.total = Number(group.price || 0) * group.qty
    }

    return Array.from(map.values())
})

// cartTotal now derives from grouped totals (price * qty) — safer and clearer
const cartTotal = computed(() => groupedCart.value.reduce((s, i) => s + Number(i.total || 0), 0))

// ---- NEW: grouped cart (for checkout) ----
// (groupedCart moved above cartTotal; original groupedCart logic updated)

// ---- fetch lessons from backend ----
async function loadLessons() {
    state.loadingLessons = true
    state.lessonsError = null

    try {
        const res = await fetch(`${API_BASE}/lessons`)
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        state.lessons = data
    } catch (err) {
        console.error('Failed to load lessons:', err)
        state.lessonsError = 'Could not load lessons from server.'
    } finally {
        state.loadingLessons = false
    }
}

// ---- NEW: place order (POST + PUT) ----
async function placeOrder({ name, phone }) {
    if (!name || !phone) {
        throw new Error('Name and phone are required')
    }

    const items = groupedCart.value
    if (!items.length) {
        throw new Error('Cart is empty')
    }

    // build order payload
    const lessonIDs = items.map(i => i._id)
    const quantities = items.map(i => i.qty)
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

    const orderPayload = {
        name,
        phone,                 // for backend validation
        phoneNumber: phone,    // matches your manual docs
        lessonIDs,
        quantities,
        total,
        createdAt: new Date().toISOString(),
    }

    // 1) POST /orders
    const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
    })

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        console.error('Order error:', errorBody)
        throw new Error('Failed to create order on server')
    }

    // 2) For each lesson in cart, update spaces via PUT /lessons/:id
    for (const item of items) {
        const lesson = state.lessons.find(l => l._id === item._id)
        if (!lesson) continue

        const newSpaces = Math.max(0, (lesson.spaces ?? 0) - item.qty)

        const putRes = await fetch(`${API_BASE}/lessons/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaces: newSpaces }),
        })

        if (!putRes.ok) {
            console.error('Failed to update spaces for lesson', item._id)
            // we don't throw here so other items can still process
        } else {
            // update local state so UI reflects new spaces
            lesson.spaces = newSpaces
        }
    }

    // 3) Clear cart
    state.cart = []
}

function setSearch(value) {
    state.search = value
}

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
        filteredLessons, 
        cartTotal,
        groupedCart,
        loadLessons,
        setSort,
        setSearch,       
        addToCart,
        removeFromCart,
        qtyInCart,
        placeOrder,
    }

}
