<template>
    <div class="main">
        <header>main-头部</header>
        <div>
            <div class="left">
                <router-link to="/home">Home</router-link> | <br>
                <router-link to="/new">New</router-link> | <br>
                <router-link to="/vuexCs">VueX</router-link> | <br>
                <router-link to="/vueTable">vueTable</router-link> | <br>
                <router-link to="/vuedesignPar">vueDesignPar</router-link>
            </div>
            <div class="right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<style>
.main .left {
    width: 20%;
    height: 1000px;
    border: 1px solid #ccc;
    float: left;
    margin-right: 20px;
}
.main .right {
    float: left;
    width: 70%;
}
</style>
