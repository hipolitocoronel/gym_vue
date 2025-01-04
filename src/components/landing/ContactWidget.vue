<template>
    <div class="grid grid-cols-12 xl:mx-32 mt-8" id="contact">
        <div class="col-span-12 md:col-span-6 mt-10 hidden lg:block">
            <img
                src="https://www.pngplay.com/wp-content/uploads/6/Fitness-PNG-HD-Quality.png"
                alt=""
            />
        </div>
        <div class="col-span-12 lg:col-span-6 mt-20">
            <h2 class="text-center font-bold text-5xl mb-4">Contáctanos</h2>
            <Form
                v-slot="$form"
                :initialValues
                :resolver
                @submit="onFormSubmit"
                class="p-8 flex flex-col gap-4"
            >
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="name">Nombre Completo</label>
                    <InputText
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        fluid
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.name?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.name.error.message }}
                    </Message>
                </div>

                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="email">Correo</label>
                    <InputText
                        id="email"
                        name="email"
                        placeholder="tu@email.com"
                        fluid
                        type="email"
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.email?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.email.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="phone">Teléfono</label>
                    <InputNumber
                        id="telefono"
                        name="phone"
                        fluid
                        placeholder="Tu teléfono"
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.phone?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.phone.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1" v-auto-animate>
                    <label for="consulta">Consulta</label>
                    <Textarea
                        id="consulta"
                        name="consulta"
                        fluid
                        rows="5"
                        class="resize-none"
                        placeholder="Ingrese su consulta"
                        autocomplete="off"
                    />

                    <Message
                        v-if="$form.consulta?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ $form.consulta.error.message }}
                    </Message>
                </div>

                <div class="flex justify-end mt-1">
                    <Button class="!font-semibold" type="submit">Enviar</Button>
                </div>
            </Form>
        </div>
    </div>
</template>
