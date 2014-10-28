<div class="page-content" tpl-article>
    <header class="tabular">
        <span style="background-image:url('/packages/redeaux/images/portfolio/cultivar.jpg');"></span>
        <div class="cellular">
            <h1><?php echo Page::getCurrentPage()->getCollectionName(); ?></h1>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-9 col-lg-7">
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                        <?php $a = new Area('Otro 1'); $a->display($c); ?>
                    </div>
                    <div class="col-sm-12 col-md-6">
                        <?php $a = new Area('Otro 2'); $a->display($c); ?>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <?php $a = new Area('Default'); $a->display($c); ?>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-lg-5">
                <?php $a = new Area('Default Sidebar'); $a->display($c); ?>
            </div>
        </div>
    </div>
</div>