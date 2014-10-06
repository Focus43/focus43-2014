<div class="page-content" tpl-work ng-class="animClass">
    <div class="inner">
        <a class="item toj" href="/work/town-of-jackson">
            <div class="tabular">
                <span class="cellular">Town Of Jackson</span>
            </div>
        </a>
        <a class="item svalinn" href="/work/svalinn">
            <div class="tabular">
                <span class="cellular">Svalinn</span>
            </div>
        </a>
        <a class="item trip-trax" href="/work/triptrax">
            <div class="tabular">
                <span class="cellular">TripTrax</span>
            </div>
        </a>
        <a class="item clinica" ng-click="view_project('clinica')">
            <div class="tabular">
                <span class="cellular">Clinica</span>
            </div>
        </a>
        <a class="item jhmr" ng-click="view_project('jackson_hole')">
            <div class="tabular">
                <span class="cellular">Jackson Hole</span>
            </div>
        </a>
        <a class="item timberland" ng-click="view_project('timberland')">
            <div class="tabular">
                <span class="cellular">Timberland</span>
            </div>
        </a>
        <a class="item tnf" ng-click="view_project('tnf')">
            <div class="tabular">
                <span class="cellular">TNF</span>
            </div>
        </a>
        <a class="item github" href="//github.com/focus43/" target="_blank">
            <div class="tabular">
                <span class="cellular">Want To See Nerd Stuff?</span>
            </div>
        </a>
    </div>

    <div ng-include="_include" class="project-view"></div>
</div>