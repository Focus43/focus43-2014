<div class="page-content" tpl-article>
    <header class="tabular">
        <span style="background-image:url('/packages/redeaux/images/portfolio/cultivar.jpg');"></span>
        <div class="cellular">
            <h1>Some title in this bitch yeaaaaa</h1>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-9">
                <?php $a = new Area('Default'); $a->display($c); ?>
            </div>
            <div class="col-sm-3">
                <?php $a = new Area('Default Sidebar'); $a->display($c); ?>
            </div>
        </div>
    </div>
</div>