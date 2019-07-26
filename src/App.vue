<template>
    <div id="app">
        <img src="./assets/logo.png" />
        <img src="./assets/img1.jpg" />
        <img src="./assets/img2.jpg" />
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {}
        },
        created() {
            // 原始数据
            const oldarr = [
                {
                    id: 2,
                    parentId: 1,
                    child: []
                },
                {
                    id: 3,
                    parentId: 1,
                    child: []
                },
                {
                    id: 4,
                    parentId: 1,
                    child: []
                },
                {
                    id: 1,
                    parentId: null,
                    child: []
                },
                {
                    id: 89,
                    parentId: 10,
                    child: []
                },
                {
                    id: 10,
                    parentId: null,
                    child: []
                }
            ]
            // 需要的数据
            const needarr = []
            oldarr.map(o => {
                if (o.parentId) {
                    // 通过 子级的 parentId，在 needarr 查找 父级
                    const fobj = needarr.find(n => n.id === o.parentId)
                    if (fobj) fobj.child.push(o)
                    else {
                        // 未找到父级，则再通过子级的 parentId，在 oldarr 查找 父级
                        const fobj = oldarr.find(n => n.id === o.parentId)
                        fobj.child.push(o)
                        needarr.push(fobj)
                    }
                } else {
                    const isInNeedarr = !!needarr.find(n => n.id === o.id)
                    if (!isInNeedarr) needarr.push(o)
                }
            })
            console.log(needarr)
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
