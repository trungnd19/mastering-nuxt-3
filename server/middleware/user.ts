import { serverSupabaseUser } from "#supabase/server"

export default defineEventHandler(async (event) => {
    // serverSupabaseUser: dùng với backend
    
    // Nếu user không đăng nhập => user là null
    // Nếu user đăng nhập => user là thông tin github profile
    const user = await serverSupabaseUser(event);

    // add user info on every single request
    event.context.user = user
    // console.log(user)
})